export const state = () => ({
	flashcards: null
})

export const getters = {
	flashcards: state => state.flashcards
}

export const mutations = {
	setFlashcards (state, flashcards) {
		state.flashcards = flashcards
	}
}

export const actions = {
	fetchFlashcards ({ commit }) {
		return this.$axios.$get('/student/flashcards')
			.then((response) => {
				commit('setFlashcards', response.flashcards)
				return true
			})
	}
}
