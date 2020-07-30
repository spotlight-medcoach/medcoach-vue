<template>
<div id="review">
  <b-container>
    <div v-if="onHttpRequest">
      <loading-state :message="message" />
    </div>
    <div v-else-if="errorHttp">
      <p>{{ message }}</p>
    </div>
    <div v-else>
      <notes-review :notes="notes" :manual_id="manual_id" :flashcards="flashcards" :review="review"/>
    </div>
  </b-container>
</div>
</template>

<script>
import { mapState } from 'vuex'
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
      review: this.$route.query.review === 'true',
      flashcards: [],
      notes: ''
    }
  },
  async created () {
    this.$store.dispatch('http_request/initHttpRequest')
    await this.getManualNote(this.manual_id)
    await this.getFlashcards(this.manual_id)
    this.$store.commit('http_request/setOnHttpRequest', false)
  },
  computed: {
    ...mapState({
      onHttpRequest: state => state.http_request.onHttpRequest,
      message: state => state.http_request.message,
      errorHttp: state => state.http_request.errorHttp
    })
  },
  methods: {
    getManualNote (manualId) {
      return this.$axios
        .get(`/manuals/note?manual_id=${manualId}`)
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
        .get(`/manuals/flashcard?manual_id=${manualId}`)
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
<style>
  #review .ql-toolbar {
    display: flex !important;
    justify-content: center !important;
  }
</style>
