<template>
<div class="row notes pt-5">
  <!-- NOTES -->
  <div class="col-9">
    <div v-if="showQuill">
      <div class="save-note">
        <b-overlay
          :show="savingNotes"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <img src="@/assets/icons/save.svg" width="30" @click="saveNote">
        </b-overlay>
      </div>
      <quill-editor
        ref="noteQuillEditor"
        v-model="content"
        :options="editorOption"
      />
    </div>
    <div id="review-content" v-else-if="content !== ''">
      <div class="ql-editor" id="print-div">
        <h3>{{ manual.manual_name }}</h3>
        <div v-html="content"></div>
      </div>
    </div>
    <div v-else>
      <h4>No hay notas para este manual.</h4>
    </div>
  </div>
  <!-- OPTIONS -->
  <div class="col-3">
    <div id="options" class="d-flex align-items-start flex-column text-center">
      <div class="option mb-auto pointer" @click="openFlashcards">
        <img src="@/assets/icons/review/flashcards.svg" width="35">
        <p>Flashcards</p>
      </div>
      <div class="option mb-auto pointer" @click="showQuill = !showQuill">
        <img src="@/assets/icons/review/edit_notes.svg" width="35">
        <p>Editar Notas</p>
      </div>
      <div class="option mb-auto">
        <nuxt-link
          class="pointer text-decoration-none"
          target="_blank"
          :to="`/manual?manual_id=${manual_id}`">
          <img src="@/assets/icons/review/show_manual.svg" width="35">
          <p>Ver Manual</p>
        </nuxt-link>
      </div>
      <div class="option mb-auto pointer" @click="printNote">
        <img src="@/assets/icons/review/print.svg" width="35">
        <p>Imprimir</p>
      </div>
      <div class="option mb-auto pointer" @click="finishReview" v-if="!is_extra">
        <img src="@/assets/icons/review/finish_review.svg" width="35">
        <p>Finalizar revisión</p>
      </div>
    </div>
  </div>
  <!-- Modal Flashcards -->
  <b-modal id="modal-flashcards" :hide-footer="true" size="lg" :centered="true" :no-close-on-backdrop="true">
    <template v-slot:modal-title>
      <div>Flashcards</div>
      <div style="font-size: 16px;"> {{flashcards_index + 1}} / {{ flashcards.length }}</div>
    </template>
    <div class="h2 mb-0 chevron" :class="{'disabled-chevron': flashcards_index <= 0}" @click="prevFlashcard">
      <b-icon icon="chevron-left"></b-icon>
    </div>
    <div id="flip-container">
      <vue-flip v-model="flipped" width="100%" height="100%">
        <!-- FRONT -->
        <template v-slot:front class="front">
          <div class="tarjeta frente" v-if="flashcard">
            <div v-if="showQuillA">
              <quill-editor
                ref="noteQuillA"
                v-model="flashcard.body_note"
                :options="editorOption"
              />
              <div class="mt-2 d-flex justify-content-end">
                <div class="mr-3">
                  <b-overlay
                    :show="savingFlashcard"
                    rounded
                    opacity="0.6"
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block">
                    <b-button size="sm" variant="outline-success" @click.stop.prevent="updateFlashcard('A')">Guardar</b-button>
                  </b-overlay>
                </div>
                <b-button size="sm" variant="danger" @click.stop.prevent="cancelQuillA">Cancelar</b-button>
              </div>
            </div>
            <div v-else @click="flipped =! flipped">
              <div class="h4 mb-1 text-right" @click.stop.prevent="openQuillA">
                <b-icon icon="pencil-square"></b-icon>
              </div>
              <div class="note-content d-flex justify-content-center align-items-center">
                <div v-html="flashcard.body_note"></div>
              </div>
              <div class="mt-3">
                Frente
              </div>
            </div>
          </div>
          <div v-else> No hay flashcards </div>
        </template>
        <!-- BACK -->
        <template v-slot:back class="back">
          <div class="tarjeta detras" v-if="flashcard">
            <div v-if="showQuillB">
              <quill-editor
                ref="noteQuillB"
                v-model="flashcard.body_user"
                :options="editorOption"
              />
              <div class="mt-2 d-flex justify-content-end">
                <div class="mr-3">
                  <b-overlay
                    :show="savingFlashcard"
                    rounded
                    opacity="0.6"
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block">
                    <b-button size="sm" variant="outline-success" @click.stop.prevent="updateFlashcard('B')">Guardar</b-button>
                  </b-overlay>
                </div>
                <b-button size="sm" variant="danger" @click.stop.prevent="cancelQuillB">Cancelar</b-button>
              </div>
            </div>
            <div v-else @click="flipped =! flipped">
              <div class="h4 mb-2 text-right" @click.stop.prevent="openQuillB">
                <b-icon icon="pencil-square"></b-icon>
              </div>
              <div class="note-content d-flex justify-content-center"  v-if="flashcard">
                <div v-html="flashcard.body_user"></div>
              </div>
              <div class="mt-3">
                Detrás
              </div>
            </div>
          </div>
          <div v-else> No hay flashcards </div>
        </template>
        <!-- END BACK -->
      </vue-flip>
    </div>
    <div class="h2 mb-0 chevron" :class="{'disabled-chevron': flashcards_index >= flashcards.length - 1}" @click="nextFlashcard">
      <b-icon icon="chevron-right"></b-icon>
    </div>
  </b-modal>
  <!-- End Modal Flashcards -->
</div>
</template>

<script>
import { printHtml } from '@/assets/js/print_html'
export default {
  name: 'notes-review',
  props: {
    manual_id: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    flashcards: {
      type: Array
    },
    review: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showQuill: false,
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
                { background: ['#FE9400', '#FFFFFF', '#FFFF00'] }
              ]
            ]
          }
        }
      },
      savingNotes: false,
      content: '',
      flashcards_index: 0,
      showQuillA: false,
      showQuillB: false,
      flipped: false,
      savingFlashcard: false,
      prevText: 'cancelado',
      is_extra: this.$route.query.extra === 'true'
    }
  },
  methods: {
    openQuillA () {
      this.prevText = this.flashcard.body_note
      this.showQuillA = true
    },
    openQuillB () {
      this.prevText = this.flashcard.body_user
      this.showQuillB = true
    },
    cancelQuillA () {
      this.showQuillA = false
      this.flashcard.body_note = this.prevText
    },
    cancelQuillB () {
      this.showQuillB = false
      this.flashcard.body_user = this.prevText
    },
    prevFlashcard () {
      if (this.flashcards_index > 0) {
        this.flashcards_index--
      }
    },
    nextFlashcard () {
      if (this.flashcards_index < this.flashcards.length - 1) {
        this.flashcards_index++
      }
    },
    openFlashcards () {
      this.$bvModal.show('modal-flashcards')
    },
    printNote () {
      this.showQuill = false
      setTimeout(() => {
        // this.$htmlToPaper('review-content')
        printHtml('review-content')
      }, 500)
    },
    finishReview () {
      this.$store.dispatch('http_request/initHttpRequest', 'Finalizando repaso, espere un momento')
      this.saveNote()
      this.$axios
        .put('/students/syllabus', {
          manual_id: this.manual_id,
          review: this.review
        })
        .then((res) => {
          console.log(res.data)
          this.$store.dispatch('fetchSyllabus')
          this.$router.push({ path: '/dashboard' })
        }).catch((err) => {
          this.$store.dispatch('http_request/errorHttp', err.response.data.message)
        })
    },
    saveNote () {
      const params = {
        manual_id: this.manual_id,
        body: this.content
      }
      this.savingNotes = true
      this.$axios
        .post('/manuals/note', params,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-type': 'application/json'
            }
          }
        )
        .then((response) => {
          console.log(response)
          this.$toastr.success('Su nota se ha acualizado correctamente', '¡Éxito!')
        })
        .catch((error) => {
          console.error(error)
          this.$toastr.error('Hubo un problema al guardar su nota', 'Error')
        })
        .finally(() => {
          this.savingNotes = false
        })
    },
    updateFlashcard (side) {
      const params = {
        flashcard_id: this.flashcard._id,
        body_note: this.flashcard.body_note,
        body_user: this.flashcard.body_user
      }
      this.savingFlashcard = true
      this.$axios
        .put('/manuals/flashcard', params,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-type': 'application/json'
            }
          }
        )
        .then((response) => {
          console.log(response)
          this.$toastr.success('Flashcard actualizada correctamente', '¡Éxito!')
          if (side === 'A') {
            this.showQuillA = false
          } else {
            this.showQuillB = false
          }
        })
        .catch((error) => {
          console.error(error)
          this.$toastr.error('Hubo un problema al guardar su flashcard', 'Error')
        })
        .finally(() => {
          this.savingFlashcard = false
        })
    }
  },
  created () {
    this.content = this.notes.slice(0, -1)
  },
  computed: {
    flashcard: {
      get () {
        if (this.flashcards.length) {
          return this.flashcards[this.flashcards_index]
        }
        return null
      },
      set (newVal) {
        this.flashcard = newVal
      }
    },
    manual () {
      const manual = this.$store.state.topics.manuals.find(element => element.manual_id === this.manual_id)
      return manual
    }
  }
}
</script>

<style lang="scss">
  #flip-container {
    width: 100%;
    height: 350px;
    padding: 30px;
    .front, .back {
      width: 100%;
      height: 100%;
    }
    .tarjeta {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0px 4px 4px rgba(189, 189, 189, 0.8);
      padding: 25px;
      .note-content {
        min-height: 170px;
        max-height: 170px;
        overflow: auto;
      }
    }
    .frente {
      background: #FFFFFF;
      border: 1px solid #000500;
    }
    .detras {
      background: #F2F2F2;
      /* Secondary/gray */
      border: 1px solid #BDBDBD;
    }
    .quill-editor {
      min-height: 215px;
      max-height: 215px;
      /* overflow: auto; */
    }
    .ql-container {
      min-height: 165px;
      max-height: 165px;
      overflow: auto;
    }
  }

  #review {
    #options {
      height: 500px;
      position: sticky;
      top: 135px;
    }
    .option {
      width: 100%;
      min-width: 100%;
    }
    .save-note {
      position: absolute;
      left: 42px;
      top: 7px;
      cursor: pointer;
      z-index: 100;
    }
  }

  #review-content {
    padding: 2rem;
  }

  #modal-flashcards {
    .modal-content {
      heigth: 450px;
    }
    .modal-header {
      border: none;
    }
    .modal-title {
      font-weight: 700;
      padding-left: 20px;
    }
    .modal-body {
      display: flex;
    }
    .chevron {
      display: flex;
      flex-direction: column;
      align-self: center;
      cursor: pointer;
    }
    .disabled-chevron {
      cursor: default;
      opacity: 0.3;
    }
  }

  .notes, #modal-flashcards {
    .ql-snow .ql-picker.ql-expanded .ql-picker-options {
      display: flex !important;
      margin-top: -6px;
    }
    .ql-snow .ql-icon-picker .ql-picker-item {
      padding: 2px 0px !important;
    }
  }
</style>
