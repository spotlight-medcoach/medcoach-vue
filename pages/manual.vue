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
          @onManualInfoLoaded="onManualInfoLoaded"
        />
      </article>
      <!----------------------------------------------------------------- DOCUMENT FILE HTML -->
      <article>
        <manual-document
          class="shadow-sm full m-2"
          :manual-id="manual_id"
          :brightness="brightness"
          :font-size="font_size"
          @onFetchedManual="allowFlashCards"
          @onCopyToFlashCard="copyToFlashCard"
          @onCopyToNotes="copyToNotes"
        />
      </article>
      <!----------------------------------------------------------------- FLASHCARDS -->
      <manual-flashcard
        v-if="showFlashCards"
        :manual-id="manual_id"
        :brightness="brightness"
        :flash-b="flash_b"
      />
    </section>
    <!-- END MANUAL CONTENT -->
    <!-- NOTES CONTENT -->
    <section class="notes-section">
      <!----------------------------------------------------------------- ACTION BUTTONS -->
      <article class="notes-actions shadow-sm m-2 mb-2">
        <div class="notes-actions-content">
          <!----------------------------------------------------------------- Ver Quiz -->
          <template v-if="manualInfo && manualInfo.quiz_file">
            <b-button
              v-b-tooltip.hover
              variant="link"
              class="quiz-icon-button"
              title="Ver Quiz"
              @click="showQuiz(manualInfo.quiz_file)"
            >
              <b-icon icon="question-circle" font-scale="1.5" class="pointer" />
            </b-button>
          </template>
          <!----------------------------------------------------------------- Marcar como aprendido -->
          <template v-if="phase && phase.id !== 2">
            <holdable-button
              ref="finish-manual-button"
              :message="
                finishedFromBackend
                  ? 'Manual finalizado'
                  : 'Manten presionado para marcar como aprendido'
              "
              :max-width="230"
              :min-width="230"
              :default-value="!(!finished && !finish_manual_extra)"
              :disabled="
                isFreeTrial ||
                  finished ||
                  finish_manual_extra ||
                  finishedFromBackend
              "
              @onCheck="finishManual"
            />
          </template>
        </div>
      </article>
      <!----------------------------------------------------------------- NOTES -->
      <section class="quill-notes-container shadow-sm full m-2 px-3 pb-3">
        <article class="h-100">
          <client-only>
            <manual-notes
              ref="notes"
              :manual-id="manual_id"
              :notes="notes"
              @isFinished="getFinishedState"
            />
          </client-only>
        </article>
      </section>
    </section>
    <!-- END NOTES CONTENT -->
    <!--------------------------------------------------------------------- NO SÉ -->
    <modal-image />
    <!--------------------------------------------------------------------- QUIZ MODAL -->
    <quiz-modal
      :quiz-url="quizUrl"
      :show="showQuizModal"
      @close="closeQuizModal"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import brightnessStates from '@/assets/json/brightness.json';
import ManualNavbar from '@/components/manual/manualNavbar.vue';
import ManualFlashcard from '@/components/manual/manualFlashcard.vue';
import ManualDocument from '@/components/manual/manualDocument.vue';
import ManualNotes from '@/components/manual/manualNotes.vue';
import ModalImage from '@/components/ModalImage';
import QuizModal from '@/components/manual/quizModal.vue';
import HoldableButton from '@/components/_functional/holdableButton.vue';
export default {
  components: {
    ManualNavbar,
    ManualFlashcard,
    ManualDocument,
    ManualNotes,
    ModalImage,
    QuizModal,
    HoldableButton,
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
      finishedFromBackend: false,
      font_size: 1.2,
      brightness: brightnessStates.light,
      showFlashCards: false,
      flash_a: '',
      flash_b: '',
      notes: 'Cargando notas...',
      message_error: 'Ocurrió un error su petición',
      error_http: false,
      manualInfo: null,
      showQuizModal: false,
      quizUrl: null,
    };
  },
  computed: {
    ...mapState({
      isFreeTrial: (state) => state.isFreeTrial,
      phase: (state) => state.phase,
    }),
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
      // Actualizar el estado de finalizado si el manual ya fue completado
      if (manualInfo.finished) {
        this.finished = true;
        this.finishedFromBackend = true;
      }
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
      // No sobrescribir si el backend ya confirmó que está finalizado
      if (!this.finishedFromBackend) {
        this.finished = isFinished;
      }
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
        if (this.$refs['finish-manual-button']) {
          this.$refs['finish-manual-button'].reset();
        }
        this.$toastr.error('Su nota está vacía', 'Error');
      }
    },
    showQuiz (quizUrl) {
      this.quizUrl = quizUrl;
      this.showQuizModal = true;
    },
    closeQuizModal () {
      this.showQuizModal = false;
      this.quizUrl = null;
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
  .notes-section {
    grid-area: notes;
    display: flex;
    flex-direction: column;
    min-width: 324px;
    max-width: 324px;
    height: calc(#{$student-main-content-height} - 2rem);
    max-height: calc(#{$student-main-content-height} - 2rem);
  }
  .notes-actions {
    background-color: #fff;
    border-radius: 4px;
    padding: 12px;
    flex-shrink: 0;
  }
  .notes-actions-content {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
  }
  .quiz-icon-button {
    padding: 8px;
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    &:hover {
      color: inherit;
      text-decoration: none;
      opacity: 0.7;
    }
    &:focus {
      box-shadow: none;
    }
  }
  .quill-notes-container {
    flex: 1;
    overflow-y: auto;
    min-width: 324px;
    max-width: 324px;
    min-height: 0;
    &.shadow-sm.full {
      height: auto;
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
