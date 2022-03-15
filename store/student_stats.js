export const state = () => ({
	studentStats: null
})

export const getters = {
	studentStats: state => state.studentStats
}

export const mutations = {
	setStudentStats (state, payload) {
		state.studentStats = payload
	}
}

export const actions = {
	saveStudentStats ({ dispatch }, payload) {
		return this.$axios.$put('/student/stats', payload)
			.then(() => {
				dispatch('fetchStudentStats')
			})
	},
	fetchStudentStats ({ commit }) {
		return this.$axios.$get('/student/stats')
			.then((result) => {
				commit('setStudentStats', result.stats)
				return true
			})
	}
}
