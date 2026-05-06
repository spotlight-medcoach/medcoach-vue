<template>
  <div id="day-topics">
    <h3 class="my-2 body-title-2">Temas del día</h3>
    <hr class="mb-0 mt-4" />
    <custom-list-preview-two-lines
      :loading="loading"
      :items="dayManuals"
      :onEmptyListMessage="'No tiene temas pendientes'"
      @item-selected="studyManual"
    />
    <template v-if="!loading && dayReviewed.length > 0">
      <h3 class="my-2 mt-4 body-title-2 review-title">Temas de repaso</h3>
      <hr class="mb-0 mt-2" />
      <custom-list-preview-two-lines
        :loading="loading"
        :items="dayReviewed"
        :onEmptyListMessage="''"
        @item-selected="reviewManual"
      />
    </template>
  </div>
</template>
<script>
import CustomListPreviewTwoLines from '~/components/_functional/customListPreviewTwoLines.vue';
export default {
  components: {
    CustomListPreviewTwoLines,
  },
  name: 'CalendarEvents',
  props: {
    loading: {
      type: Boolean,
      default: () => true,
    },
    day: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    dayManuals () {
      const manuals = this.day?.events?.[0]?.manuals;
      if (!manuals || !manuals.length) { return []; }
      return manuals.map((manual) => ({
        title: manual.manual_name,
        hint: manual.manual_subtopic_name,
        enabled: true,
        data: manual,
      }));
    },
    dayReviewed () {
      const reviewed = this.day?.events?.[0]?.reviewed;
      if (!reviewed || !reviewed.length) { return []; }
      return reviewed.map((manual) => ({
        title: manual.manual_name,
        hint: manual.reviewed
          ? `✓ ${manual.manual_subtopic_name || manual.subtopic_name}`
          : (manual.manual_subtopic_name || manual.subtopic_name),
        enabled: !manual.reviewed,
        data: manual,
      }));
    },
  },
  methods: {
    studyManual (manual) {
      if (this.$store.state.phase.id === 2) {
        this.$router.push({
          path: '/review',
          query: { manual_id: manual.manual_id, review: false },
        });
      } else {
        this.$router.push({
          path: '/manual',
          query: { manual_id: manual.manual_id },
        });
      }
    },
    reviewManual (manual) {
      this.$router.push({
        path: '/review',
        query: { manual_id: manual.manual_id, review: true },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#day-topics {
  hr {
    border-color: #000000;
  }
  .review-title {
    color: #E6852E;
  }
  .topic {
    border-bottom: 1px solid #979797;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-auto-rows: 1fr 1fr;
    .body-title-4 {
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
