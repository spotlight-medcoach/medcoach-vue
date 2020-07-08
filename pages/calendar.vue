<template>
<b-container>
  <div v-if="fethcedData" class="my-4">
    <div v-show="phase.id" class="mt-5">
      <phases-index :student="student" :phase="phase" />
    </div>
    <vue-event-calendar :events="dayEvents" title="Temas" @month-changed="handleMonthChanged" v-if="!reloadData">
      <template scope="props">
        <div v-for="(event, index) in props.showEvents" class="event-item" :key="'llave' + index">
          <div v-for="(manual, indexManuals) in event.manuals" :key="'manual' + index + indexManuals">
            <div class="item-card-done d-flex justify-content-between align-items-center" v-if="manual.finished">
              <div>
                <div class="item-manual mb-1">{{ manual.manual_name }}</div>
                <div>{{ manual.manual_subtopic_name }}</div>
              </div>
              <div class="pr-2">
                <img src="@/assets/orange_check.svg" width="33">
              </div>
            </div>
            <div class="item-card" v-else>
              <nuxt-link
              class="pointer text-decoration-none"
              target="_blank"
              :to="`/manual?manual_id=${manual.manual_id}`">
                <div class="item-manual">{{ manual.manual_name }}</div>
                <div>{{ manual.manual_subtopic_name }}</div>
              </nuxt-link>
            </div>
          </div>
        </div>
      </template>
    </vue-event-calendar>
    <loading-state message="Cargando el calendario, por favor espere" v-else/>
  </div>
  <div v-else-if="http_error">
    <div class="mt-5 d-flex justify-content-around" style="font-size: 28px;">
      Error al obtener el Calendario
    </div>
  </div>
  <div v-else>
    <loading-state message="Cargando el calendario, por favor espere" />
  </div>
</b-container>
</template>

<script>
import moment from 'moment'
import PhasesIndex from '@/components/phases/phasesIndex.vue'
import LoadingState from '@/components/LoadingState.vue'

export default {
  components: {
    PhasesIndex,
    LoadingState
  },
  data () {
    moment.locale('es')
    return {
      days: null,
      http_error: false,
      fethcedData: false,
      student: {
        free_day: null,
        end_date: null,
        test_date: null
      },
      phase: {
        id: null,
        progress: 0,
        total: 0,
        init_date_phase_2: null
      },
      daysDisabled: [0, 0, 0, 0, 0, 0, 0],
      min_day: null,
      max_day: null,
      current_month: 0,
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
        this.$EventCalendar.toDate(this.now.format('YYYY/MM/DD'))
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
          this.fethcedData = true
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
    }
  }
}
</script>
<style>
@media screen and (min-width: 1600px) {
  .container {
    max-width: 1400px !important;
  }
}
</style>
