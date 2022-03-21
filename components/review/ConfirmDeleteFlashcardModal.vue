<template>
	<b-modal
		id="confirm-delete-flashcard-modal"
		cancel-title="Cancelar"
		cancel-variant="danger"
		ok-title="Sí, eliminarla"
		ok-variant="secondary"
		@hide="onHide"
		@ok="onDelete"
	>
		<p class="title-sm">¿Realmente desea eliminar esta flashcard?</p>
	</b-modal>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
	data () {
		return {
			loading: true
		}
	},
	computed: {
		...mapGetters({
			selectedFlashcardId: 'flashcards/selectedFlashcardId'
		})
	},
	methods: {
		onHide () {
			this.$store.commit('flashcards/setFlashcardId', null)
		},
		onDelete () {
			this.$store.dispatch('flashcards/deleteFlashcard', this.selectedFlashcardId)
		}
	}
}
</script>
