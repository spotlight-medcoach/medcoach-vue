<template>
  <div>
    <div v-if="fetchedData">
      <vue-event-calendar
        :events="dayEvents"
        @month-changed="handleMonthChanged"
        @day-changed="calendarDayChanged"
      />
    </div>
    <div v-else-if="http_error">
      <div class="mt-5 d-flex justify-content-around">
        Error al obtener el Calendario
      </div>
    </div>
    <div v-if="!fetchedData || reloadData">
      <loading-state message="Cargando el calendario, por favor espere" />
    </div>
  </div>
</template>
<script>

import moment from 'moment'
import LoadingState from '@/components/LoadingState.vue'

export default {
  components: {
    LoadingState
  },
  layout: 'new_default',
  data () {
    moment.locale('es')
    return {
      http_error: false,
      fetchedData: false,
      phase: {
        id: null,
        progress: 0,
        total: 0,
        init_date_phase_2: null
      },
      selectedDay: '',
      days: null,
      student: {
        free_day: null,
        end_date: null,
        test_date: null
      },
      daysDisabled: [0, 0, 0, 0, 0, 0, 0],
      min_day: null,
      max_day: null,
      now: null,
      reloadData: false
    }
  },
  computed: {
    dayEvents () {
      let events = []
      if (this.days) {
        events = this.days.filter((day) => {
          if (day.manuals.length) {
            day.date = day.date.replace(/-/g, '/')
            day.date = day.date.replace(/\/0/g, '/')
            day.title = 'Titulo'
            return true
          }
          return false
        })
        this.$EventCalendar.toDate(this.now.format('YYYY/M/DD'))
      }
      return events
    }
  },
  async created () {
    this.now = moment()
    const actualDay = this.now.date()
    this.min_day = 1 - actualDay
    this.max_day = this.now.daysInMonth() - actualDay
    await this.fetchInfo()
    await this.fetchSyllabus(this.min_day, this.max_day)
  },
  methods: {
    fetchSyllabus (minDay, maxDay) {
      return this.$axios
        .post('/students/syllabus', {
          min_index: minDay,
          max_index: maxDay,
          days_disabled: this.daysDisabled
        },
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          const data = response.data
          this.days = data.days
          this.phase.id = data.phase
          this.phase.progress = data.progress
          this.phase.total = data.total
          this.phase.init_date_phase_2 = data.start_phase_two
          this.fetchedData = true
        })
        .catch((error) => {
          this.http_error = true
          console.error(error)
        })
    },
    fetchInfo () {
      return this.$axios
        .get('/students/info', {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          const data = response.data
          this.student = data.student
          this.daysDisabled[this.student.free_day] = 1
        })
    },
    async handleMonthChanged (params) {
      if (params.next) {
        this.now.add(1, 'M')
        this.min_day = this.max_day + 1
        this.max_day = this.min_day + this.now.daysInMonth() - 1
      } else if (params.prev) {
        this.now.subtract(1, 'M')
        this.max_day = this.min_day - 1
        this.min_day = this.max_day - this.now.daysInMonth() + 1
      }
      this.reloadData = true
      await this.fetchSyllabus(this.min_day, this.max_day)
      this.reloadData = false
    },
    calendarDayChanged (day) {
      this.$emit('day-changed', day)
    }
  }
}
</script>
