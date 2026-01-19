<template>
  <div id="manuals" class="p-2">
    <!-- MANUALS CONTENT BAR -->
    <section class="general-container d-flex align-content-stretched">
      <!-------------------------------------------------------------------------------- Topic Progress column -->
      <article class="p-2">
        <ManualsProgress class="shadow-sm full px-3 py-3" />
      </article>
      <!-------------------------------------------------------------------------------- SubTopics column -->
      <article class="p-2">
        <ManualsSubTopics class="shadow-sm full px-4 py-4" />
      </article>
      <!-------------------------------------------------------------------------------- Manual List column -->
      <article class="p-2">
        <div
          v-if="isNotes"
          class="d-flex align-items-center justify-content-center shadow-sm p-3 mb-3"
        >
          <div class="text-center body-medium-3">Notas y Flashcards</div>
        </div>
        <ManualsStudyGuide
          class="shadow-sm px-4 py-4"
          :class="isNotes ? 'full reduced' : 'full'"
          :is-notes="isNotes"
        />
      </article>
    </section>
    <!-- END MANUALS CONTENT BAR -->
  </div>
</template>

<script>
import ManualsProgress from '@/components/manuals/manualsProgress.vue';
import ManualsSubTopics from '@/components/manuals/manualsSubTopics.vue';
import ManualsStudyGuide from '@/components/manuals/manualsStudyGuide.vue';

export default {
  components: {
    ManualsProgress,
    ManualsSubTopics,
    ManualsStudyGuide,
  },
  layout: 'new_default',
  props: {
    isNotes: {
      type: Boolean,
      default: false,
    },
  },
  mounted () {
    // Forzar actualización de topics al entrar a manuals
    this.$store.dispatch('topics/fetchTopics', true);
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables/_student_main.scss';
.general-container {
  min-height: 100%;
  > article {
    min-height: calc(#{$student-main-content-height} - 1rem);
    max-height: 622px;
    flex-grow: 1;
    > .shadow-sm {
      background-color: #fff;
      &.full {
        padding-top: 1.7vmax !important;
        height: 100%;
      }
      &.full.reduced {
        height: calc(100% - 56px - 1rem);
      }
    }
    &:nth-child(1) {
      flex-basis: 280px;
      max-width: 400px;
    }
    &:nth-child(2) {
      flex-basis: 240px;
      max-width: 370px;
    }
    &:nth-child(3) {
      flex-basis: 640px;
      > .shadow-sm {
        overflow-y: scroll;
      }
    }
  }
}
</style>
