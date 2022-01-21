<template>
  <div>
    <div>
      {{day}}
      <cal-events
        :title="'Hola'"
        :dayEvents="day"
        :locale="locale"
        :color="color">
      </cal-events>
    </div>
  </div>
</template>

<script>

import calEvents from '@/components/_functional/vue-event-calendar/components/cal-events.vue'

export default {
  name: 'CalendarEvents',
  components: {
    'cal-events': calEvents
  },
  props: {
    day: {
      type: Object,
      default: () => {}
    },
    locale: {
      type: String,
      default: () => 'es'
    },
    color: {
      type: String,
      default: () => '#ffffff'
    }
  },
  computed: {
  },
  methods: {
    goToManual (id) {
      if (this.$store.state.phase.id === 2) {
        this.$router.push({ path: '/review', query: { manual_id: id, review: false } })
      } else {
        this.$router.push({ path: '/manual', query: { manual_id: id } })
      }
    },
    goToReview (id) {
      this.$router.push({ path: '/review', query: { manual_id: id, review: true } })
    }
  }
}
</script>
