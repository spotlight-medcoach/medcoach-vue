export const state = () => ({
	flashcards: null,
	random_activated: false,
	repeat_activated: false,
	selected_flashcard_id: null
})

export const getters = {
	flashcards: state => state.flashcards,
	selectedFlashcard: state => state.flashcards.find(flashcard => flashcard.id === state.selected_flashcard_id),
	randomActivated: state => state.random_activated,
	repeatActivated: state => state.repeat_activated
}

export const mutations = {
	setFlashcards (state, flashcards) {
		state.flashcards = flashcards
	},
	deleteFlashcard (state, flashcardId) {
		state.flashcards = state.flashcards.filter(flashcard => (flashcard !== flashcardId))
	},
	setFlashcardId (state, flashcardId) {
		state.selected_flashcard_id = flashcardId
	},
	setRandomActivated (state, payload) {
		state.random_activated = payload
	},
	setRepeatActivated (state, payload) {
		state.repeat_activated = payload
	}
}

export const actions = {
	fetchFlashcards ({ commit }) {
		return this.$axios.$get('/student/flashcards')
			.then((response) => {
				commit('setFlashcards', response.flashcards)
				return true
			})
	},
	fetchFlashcardsByManualId ({ commit }, manualId) {
		return this.$axios
			.get(`/manuals/flashcard?manual_id=${manualId}`)
			.then((response) => {
				commit('setFlashcards', response.data.flashcards)
				return true
			})
	},
	deleteFlashcard ({ commit }, flashcardId) {
		commit('deleteFlashcard', flashcardId)
	},
	addFlashcard ({ commit }, flashcardId) {
		commit('addFlashcard')
	}
}
