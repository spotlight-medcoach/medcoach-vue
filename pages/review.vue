<template>
<div id="review">
  <b-container>
    <div v-if="onHttpRequest">
      <loading-state :message="message" />
    </div>
    <div v-else-if="error_http">
      <p>{{ message }}</p>
    </div>
    <div v-else>
      <notes-review :notes="notes" :manual_id="manual_id" :flashcards="flashcards"/>
    </div>
  </b-container>
</div>
</template>

<script>
import LoadingState from '@/components/LoadingState.vue'
import NotesReview from '@/components/review/Notes.vue'
export default {
  components: {
    LoadingState,
    NotesReview
  },
  data () {
    return {
      manual_id: this.$route.query.manual_id,
      error_http: false,
      message: 'Cargando notas, por favor espere',
      onHttpRequest: true,
      flashcards: [],
      notes: ''
    }
  },
  async created () {
    await this.getManualNote(this.manual_id)
    await this.getFlashcards(this.manual_id)
    this.onHttpRequest = false
  },
  methods: {
    getManualNote (manualId) {
      return this.$axios
        .get(`/manuals/note?manual_id=${manualId}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-type': 'application/json'
            }
          }
        )
        .then((res) => {
          this.notes = res.data.note
        }).catch((err) => {
          console.log(err)
          this.error_http = true
          this.message = 'Ocurrió un error al obtener sus notas'
        })
    },
    getFlashcards (manualId) {
      return this.$axios
        .get(`/manuals/flashcard?manual_id=${manualId}`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-type': 'application/json'
            }
          }
        )
        .then((res) => {
          this.flashcards = res.data.flashcards
        }).catch((err) => {
          console.log(err)
          this.error_http = true
          this.message = 'Ocurrió un error al obtener sus flashcards'
        })
    }
  }
}
</script>
