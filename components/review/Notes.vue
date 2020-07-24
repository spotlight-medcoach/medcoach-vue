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
    <div id="review-content" v-html="content" v-else>
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
      <div class="option mb-auto pointer" @click="finishReview">
        <img src="@/assets/icons/review/print.svg" width="35">
        <p>Finalizar revisión</p>
      </div>
    </div>
  </div>
  <!-- Modal Flashcards -->
  <b-modal id="modal-flashcards" title="BootstrapVue">
    <p class="my-4">Hello from modal!</p>
  </b-modal>
</div>
</template>

<script>
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
                { align: ['center', 'left'] },
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
      content: ''
    }
  },
  methods: {
    openFlashcards () {
      this.$bvModal.show('modal-flashcards')
    },
    printNote () {
      this.showQuill = false
      setTimeout(() => {
        this.$htmlToPaper('review-content')
      }, 500)
    },
    finishReview () {
      this.$store.dispatch('initHttpRequest', 'Finalizando repaso, espere un momento')
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      this.saveNote()
      this.$axios
        .put('/students/syllabus', {
          manual_id: this.manual_id,
          review: this.review
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(res.data)
          this.$router.push({ path: '/dashboard' })
        }).catch((err) => {
          this.$store.dispatch('errorHttp', err.response.data.message)
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
    }
  },
  created () {
    this.content = this.notes.slice(0, -1)
  }
}
</script>

<style lang="scss">
  #review {
    #options {
      height: 500px;
      position: sticky;
      top: 122px;
    }
    .option {
      width: 100%;
      min-width: 100%;
    }
    .save-note {
      position: absolute;
      left: 4%;
      top: 0.5%;
      cursor: pointer;
    }
  }
  #review-content {
    padding: 2rem;
  }
</style>
