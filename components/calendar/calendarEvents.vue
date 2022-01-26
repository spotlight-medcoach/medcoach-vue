<template>
  <div id="day-topics">
    <h3 class="my-2 subheader-xl font-weight-utra-bolder">Temas del día</h3>
    <hr class="mb-0 mt-4">
    <custom-list-preview-two-lines
      :loading="loading"
      :items="dayManuals"
      :onEmptyListMessage="'No tiene temas pendientes'"
      @item-selected="itemSelected"
    />
  </div>
</template>
<script>
import CustomListPreviewTwoLines from '~/components/_functional/customListPreviewTwoLines.vue'
export default {
  components: {
    CustomListPreviewTwoLines
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
      return this.day.events[0].manuals
        .map((manual) => {
          return {
            title: manual.manual_name,
            hint: manual.manual_subtopic_name,
            enabled: true,
            data: manual
          }
        })
    }
  },
  methods: {
    itemSelected (manual) {
      if (this.$store.state.phase.id === 2) {
        this.$router.push({ path: '/review', query: { manual_id: manual.manual_id, review: false } })
      } else {
        console.log(manual)
        this.$router.push({ path: '/manual', query: { manual_id: manual.manual_id } })
      }
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
      .subheader-lg {
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
