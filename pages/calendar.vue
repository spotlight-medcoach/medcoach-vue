<template>
  <div id="calendar" class="p-2">
    <section class="general-container"><!--------------------------------------- MAIN CONTENT (LEFT) -->
      <!-- QUOTE -->
      <article class="shadow-sm m-2 mb-3 ">
        <motivational-quote />
      </article>
      <!-- PHASE PROGRESS BAR -->
      <article class="shadow-sm p-4 m-2 mb-3">
        <phases-index />
      </article>
      <!-- CALENDAR -->
      <article class="shadow-sm p-4 m-2">
        <calendar-calendar
          @day-changed="calendarDayChanged"
        />
      </article>
      <!-- END CALENDAR -->
    </section>
    <section class="topics-day-container shadow-sm p-3 m-2"><!-------- EXTRA CONTENT (RIGHT) -->
      <!-- TOPICS BY DAY -->
      <calendar-events
        :loading="!calendarSelectedDayData"
        :day="calendarSelectedDayData"
      />
    </section>
  </div>
</template>
<script>

import MotivationalQuote from '~/components/_functional/MotivationalQuote.vue'
import PhasesIndex from '@/components/phases/phasesIndex.vue'
import CalendarCalendar from '@/components/calendar/calendarCalendar.vue'
import CalendarEvents from '@/components/calendar/calendarEvents.vue'

export default {
  components: {
    MotivationalQuote,
    PhasesIndex,
    CalendarCalendar,
    CalendarEvents
  },
  layout: 'new_default',
  data () {
    return {
      calendarSelectedDayData: undefined
    }
  },
  methods: {
    calendarDayChanged (day) {
      this.calendarSelectedDayData = day
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
    > section {
      overflow-y: auto;
    }
    section.shadow-sm,
    article.shadow-sm {
      background-color: #fff;
    }
  }
</style>
