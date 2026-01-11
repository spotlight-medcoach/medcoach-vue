<template>
  <section id="note-review">
    <div class="note-sheet">
      <div class="note-sheet-header row">
        <!----- Botón de regresar------->
        <div class="col-sm my-auto" @click="$router.go(-1)">
          <div class="d-flex align-items-center back-link">
            <ExpandIcon />
            <p>Regresar</p>
          </div>
        </div>
        <!----- Título ----------------->
        <div class="col-sm text-center my-auto">
          <p class="manual-title">{{ title }}</p>
        </div>
        <!----- Marcar como aprendido -->
        <div class="col-sm">
          <div v-if="!note.finished" class="d-flex justify-content-end">
            <div class="d-inline-flex align-items-center">
              <holdable-button
                message="Manten presionado para marcar como aprendido"
                :maxWidth="230"
                @onCheck="finishReview"
              >
              </holdable-button>
            </div>
          </div>
        </div>
      </div>
      <div class="note-edition-area">
        <!-- Contenedor de la nota del manual -->
        <div id="review-content" v-if="printing">
          <div class="ql-editor" id="print-div">
            <h3>{{ title }}</h3>
            <div v-html="content"></div>
          </div>
        </div>
        <div v-else class="position-relative">
          <!---- Botón de guardar nota -->
          <div class="save-note">
            <b-overlay
              :show="savingNotes"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <img src="@/assets/icons/save.svg" width="30" @click="saveNote" />
            </b-overlay>
          </div>
          <!----- Editor de Nota -------->
          <quill-editor
            ref="noteQuillEditor"
            v-model="content"
            :options="editorOption"
          />
        </div>
      </div>
    </div>
    <!----- Menú de opciones de la nota --->
    <div class="note-menu">
      <ul class="note-menu-list">
        <li @click="printNote">
          <PrintIcon />
        </li>
        <li>
          <nuxt-link
            class="pointer text-decoration-none"
            target="_blank"
            :to="`/manual?manual_id=${manual_id}`"
          >
            <ManualsIcon />
          </nuxt-link>
        </li>
        <li @click="goToFlashcardsList">
          <ExcludeIcon />
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { printHtml } from '@/assets/js/print_html';
import HoldableButton from '@/components/_functional/holdableButton.vue';
import ExpandIcon from '@/components/icons/ExpandIcon.vue';
import ManualsIcon from '@/components/icons/ManualsIcon.vue';
import ExcludeIcon from '@/components/icons/ExcludeIcon.vue';
import PrintIcon from '@/components/icons/PrintIcon.vue';

export default {
  props: {
    manual_id: {
      type: String,
      default: '',
    },
    note: {
      type: Object,
      default: null,
    },
    review: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    HoldableButton,
    ExpandIcon,
    ManualsIcon,
    ExcludeIcon,
    PrintIcon,
  },
  data () {
    return {
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline'],
              [
                { align: [] },
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
                { color: ['#000500', '#FE9400', '#0070C0'] },
                { background: ['#FE9400', '#FFFFFF', '#FFFF00'] },
              ],
            ],
          },
        },
      },
      savingNotes: false,
      content: '',
      printing: false,
      studyTimeTimelapseListener: undefined,
    };
  },
  computed: {
    title () {
      let name = '';
      this.topics.some((topic) => {
        return topic.subtopics.some((subtopic) => {
          return subtopic.manuals.some((manual) => {
            if (manual.id === this.manual_id) {
              name = manual.name;
              return true;
            }
            return false;
          });
        });
      });
      return name;
    },
    ...mapState({
      topics: (state) => state.topics.data,
    }),
    ...mapGetters({
      notesTimelapse: 'studytime/notesTimelapse',
    }),
  },
  methods: {
    saveNote () {
      const params = {
        manual_id: this.manual_id,
        body: this.content,
      };
      this.savingNotes = true;
      this.$axios
        .post('/student/manuals/note', params, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response);
          this.$toastr.success(
            'Su nota se ha acualizado correctamente',
            '¡Éxito!',
          );
        })
        .catch((error) => {
          console.error(error);
          this.$toastr.error('Hubo un problema al guardar su nota', 'Error');
        })
        .finally(() => {
          this.savingNotes = false;
        });
    },
    printNote () {
      this.printing = true;
      setTimeout(() => {
        printHtml('review-content', null, () => {
          this.printing = false;
        });
      }, 500);
    },
    finishReview () {
      this.$store.dispatch(
        'http_request/initHttpRequest',
        'Finalizando repaso, espere un momento',
      );
      this.saveNote();
      this.$axios
        .put('/student/syllabus', {
          manual_id: this.manual_id,
          review: this.review,
        })
        .then((res) => {
          console.log(res.data);
          this.$store.dispatch('fetchSyllabus');
          this.$router.push({ path: '/dashboard' });
        })
        .catch((err) => {
          this.$store.dispatch(
            'http_request/errorHttp',
            err.response.data.message,
          );
        });
    },
    addStudyTime () {
      this.studyTimeTimelapseListener = setInterval(
        function () {
          this.$store.dispatch('studytime/addStudyTime', 'notes');
        }.bind(this),
        this.notesTimelapse * 60000,
      );
    },
    finalize () {
      this.clearInterval(this.studyTimeTimelapseListener);
    },
    goToFlashcardsList () {
      this.$emit('setCurrentComponent', 'flashcards_list');
    },
  },
  created () {
    this.content = this.note.note.slice(0, -1);
  },
  mounted () {
    // this.addStudyTime()
  },
};
</script>
<style lang="scss">
#note-review {
  position: relative;
  padding: 42px 0px;

  .note-sheet {
    display: inline-block;
    background: #ffffff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.239922);

    #review-content {
      padding: 2rem;
    }

    .note-sheet-header {
      padding: 12px;
      margin: 20px 33px 16px 33px;
    }
    .note-edition-area {
      /*position: relative;*/
      margin: 0px 67px;
      margin-bottom: 16px;
      width: 1000px;

      .save-note {
        position: absolute;
        left: 7%;
        top: 7px;
        cursor: pointer;
        z-index: 100;
      }

      .ql-container.ql-snow {
        border: none !important;
      }

      .ql-toolbar.ql-snow {
        width: 90%;
        margin: auto;
        border-left: none !important;
        border-right: none !important;
      }
    }
  }

  .note-menu {
    background: #ffffff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.239922);
    width: 74px;
    padding: 24px 0px;
    position: absolute;
    right: -60px;
    top: 200px;

    .note-menu-list {
      list-style: none;
      list-style-type: none;
      margin: 0;
      padding: 0;
      text-align: center;

      li {
        cursor: pointer;
        & + li {
          margin-top: 32px;
        }
      }
    }
  }
}
</style>
