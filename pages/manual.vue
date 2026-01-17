<template>
  <div id="manual" class="p-2">
    <div v-if="error_http" style="font-size: 28px">
      {{ message_error }}
    </div>

    <!-- MANUAL CONTENT -->
    <section class="general-container">
      <!----------------------------------------------------------------- NAVBAR -->
      <article class="shadow-sm m-2 mb-3">
        <manual-navbar
          ref="manual-navbar-header"
          :manual-id="manual_id"
          :allow-finish-manual="!finished && !finish_manual_extra"
          @onChangeFontSize="changeFontSize"
          @onChangeBrightness="changeBrightness"
          @onFinishManual="finishManual"
          @onManualInfoLoaded="onManualInfoLoaded"
        />
      </article>
      <!----------------------------------------------------------------- DOCUMENT FILE HTML -->
      <article>
        <manual-document
          class="shadow-sm full m-2"
          :manual_id="manual_id"
          :brightness="brightness"
          :font_size="font_size"
          @onFetchedManual="allowFlashCards"
          @onCopyToFlashCard="copyToFlashCard"
          @onCopyToNotes="copyToNotes"
        />
      </article>
      <!----------------------------------------------------------------- FLASHCARDS -->
      <manual-flashcard
        v-if="showFlashCards"
        :manual_id="manual_id"
        :brightness="brightness"
        :flash_b="flash_b"
      />
    </section>
    <!-- END MANUAL CONTENT -->
    <!-- NOTES CONTENT -->
    <section class="quill-notes-container shadow-sm full m-2 px-3 pb-3">
      <!----------------------------------------------------------------- NOTES -->
      <article class="h-100">
        <client-only>
          <manual-notes
            ref="notes"
            :manual_id="manual_id"
            :notes="notes"
            @isFinished="getFinishedState"
          />
        </client-only>
      </article>
    </section>
    <!-- END NOTES CONTENT -->
    <!--------------------------------------------------------------------- NO SÉ -->
    <modal-image />
  </div>
</template>

<script>
import brightnessStates from '@/assets/json/brightness.json';
import ManualNavbar from '@/components/manual/manualNavbar.vue';
import ManualFlashcard from '@/components/manual/manualFlashcard.vue';
import ManualDocument from '@/components/manual/manualDocument.vue';
import ManualNotes from '@/components/manual/manualNotes.vue';
import ModalImage from '@/components/ModalImage';
export default {
  components: {
    ManualNavbar,
    ManualFlashcard,
    ManualDocument,
    ManualNotes,
    ModalImage,
  },
  async beforeRouteLeave (to, from, next) {
    await this.$refs.notes.finalize();
    next();
  },
  layout: 'new_default',
  data () {
    return {
      manual_id: this.$route.query.manual_id,
      is_extra: this.$route.query.extra === 'true',
      finish_manual_extra: this.$route.query.finishManualExtra === 'true',
      selectedImage: '',
      finished: false,
      font_size: 1.2,
      brightness: brightnessStates.light,
      showFlashCards: false,
      flash_a: '',
      flash_b: '',
      notes: 'Cargando notas...',
      message_error: 'Ocurrió un error su petición',
      error_http: false,
      manualInfo: null,
    };
  },
  watch: {
    $route (to, from) {
      if (from.manual_id !== to.query.manual_id) {
        this.manual_id = to.query.manual_id;
      }
    },
  },
  methods: {
    onManualInfoLoaded (manualInfo) {
      // Guardar la información del manual para uso futuro
      this.manualInfo = manualInfo;
      // Aquí puedes usar manualInfo.topic, manualInfo.subtopic, manualInfo.reading_time
    },
    allowFlashCards () {
      this.showFlashCards = true;
    },
    changeFontSize (fontSize) {
      this.font_size = fontSize;
    },
    changeBrightness (brightnessState) {
      this.brightness = brightnessState;
    },
    getFinishedState (isFinished) {
      this.finished = isFinished;
    },
    copyToFlashCard (htmlSelection) {
      this.flash_b = htmlSelection;
    },
    copyToNotes (htmlSelection) {
      this.notes = htmlSelection;
    },
    finishManual () {
      if (this.$refs.notes.content.trim() !== '') {
        this.$axios
          .put('/student/syllabus', {
            manual_id: this.manual_id,
            extra: this.is_extra,
          })
          .then((res) => {
            console.log('res', res);
            this.$toastr.success(res.data.message);
            this.$store.dispatch('fetchSyllabus');
            this.$router.push({ path: '/dashboard' });
          })
          .catch((err) => {
            this.error_http = true;
            this.message_error = err.response.data.message;
          });
      } else {
        this.$refs['manual-navbar-header'].resetFinishManualButton();
        this.$toastr.error('Su nota está vacía', 'Error');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/variables/_student_main.scss';
#manual {
  display: grid;
  grid-template-columns: 1fr minmax(324px, auto);
  grid-template-areas: 'main notes';
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  .general-container {
    grid-area: main;
    position: relative;
    min-width: 0;
    .shadow-sm.full {
      height: calc(#{$student-main-content-height} - 3rem - 60px);
    }
  }
  .quill-notes-container {
    grid-area: notes;
    overflow-y: auto;
    min-width: 324px;
    &.shadow-sm.full {
      height: calc(#{$student-main-content-height} - 2rem);
    }
  }
  section.shadow-sm,
  article.shadow-sm {
    background-color: #fff;
  }
  .shadow-sm.full {
    overflow-y: auto;
  }
}
</style>
<style lang="scss">
#manual {
  .ql-container,
  .ql-toolbar {
    border: none !important;
  }
  .ql-toolbar {
    border-bottom: 1px solid #000 !important;
    text-align: center;
  }
}
</style>
