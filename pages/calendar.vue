<template>
  <div id="calendar" class="p-2 pt-4 pl-4 pt-lg-5">
    <section class="general-container"><!--------------------------------------- MAIN CONTENT (LEFT) -->
      <!-- QUOTE -->
      <article class="p-2">
        <motivational-quote class="shadow-sm" />
      </article>
      <!-- END QUOTE -->
      <!-- PHASE PROGRESS BAR -->
      <article class="p-2">
        <phases-index
          :loading="!fetchedData"
          class="shadow-sm p-4"
        />
      </article>
      <!-- END PHASE PROGRESS BAR -->
      <!-- CALENDAR -->
      <article class="p-2">
        <div class="shadow-sm p-4">
          <div v-if="fetchedData && !reloadData">
            <vue-event-calendar
              :events="dayEvents"
              @month-changed="handleMonthChanged"
              @day-changed="calendarDayChanged"
              @options-changed="calendarOptionsChanged"
            />
          </div>
          <div v-else-if="http_error">
            <div class="mt-5 d-flex justify-content-around" style="font-size: 28px;">
              Error al obtener el Calendario
            </div>
          </div>
          <div v-else>
            <loading-state message="Cargando el calendario, por favor espere" />
          </div>
        </div>
      </article>
      <!-- END CALENDAR -->
    </section>
    <section class="topics-day-container"><!-------- EXTRA CONTENT (RIGHT) -->
      <!-- TOPICS BY DAY -->
      <article class="p-2">
        <calendar-events
          class="shadow-sm p-4"
          :loading="!fetchedData"
          :day="calendarSelectedDayData"
        />
      </article>
    </section>
  </div>
</template>
<script>

import moment from 'moment'
import LoadingState from '@/components/LoadingState.vue'
import MotivationalQuote from '@/components/_functional/motivationalQuote.vue'
import PhasesIndex from '@/components/phases/phasesIndex.vue'
import CalendarEvents from '@/components/calendar/calendarEvents.vue'

export default {
  components: {
    LoadingState,
    MotivationalQuote,
    PhasesIndex,
    CalendarEvents
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
      reloadData: false,
      calendarSelectedDayData: undefined,
      calendarOptionsData: undefined
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
      this.calendarSelectedDayData = day
    },
    calendarOptionsChanged (options) {
      this.calendarOptionsData = options
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/css/variables/_student_main.scss';
  #calendar {
    display: grid;
    grid-template-columns: 3fr minmax(340px, 1fr);
    grid-template-areas:
      "main topics";
    .general-container {
      grid-area: main;
    }
    .topics-day-container {
      grid-area: topics;
      .shadow-sm {
        height: calc( #{$student-main-content-height} - 5.5rem );
      }
    }
    article > .shadow-sm {
      background-color: #fff;
    }
  }
</style>
