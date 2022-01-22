<template>
  <div id="day-topics">
    <h3 class="my-2 header-md">Temas del día</h3>
    <hr class="mb-0 mt-4">
    <manual-list-preview
      :loading="loading"
      :manuals="dayManuals"
    />
    <div v-if="dayManuals.length === 0 & !loading">
      <p class="text-center mt-5" >
        Sin temas pendientes
      </p>
    </div>
  </div>
</template>

<script>
import ManualListPreview from '@/components/_functional/manualListPreview.vue'
export default {
  components: {
    ManualListPreview
  },
  name: 'CalendarEvents',
  props: {
    loading: {
      type: Boolean,
      default: () => true
    },
    day: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    dayManuals () {
      if (!this.day) { return [] }
      if (!this.day.events) { return [] }
      if (!this.day.events.length) { return [] }
      if (!this.day.events[0].manuals) { return [] }
      if (!this.day.events[0].manuals.length) { return [] }
      return this.day.events[0].manuals.map(
        (manual) => {
          return {
            title: manual.manual_name,
            hint: manual.manual_subtopic_name
          }
        }
      )
    }
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
<style lang="scss" scoped>
  #day-topics {
    hr {
      border-color:#000000;
    }
    .topic {
      border-bottom: 1px solid #979797;
      display: grid;
      grid-template-columns: 1fr auto;
      grid-auto-rows: 1fr 1fr;
      .subheader-md {
        font-weight: 900;
      }
      .icon-container {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
        align-self: center;
      }
    }
    .disabled {
      opacity: 0.3;
    }
  }
</style>
