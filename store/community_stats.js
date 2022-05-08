export const state = () => ({
	communityStats: null
})

export const getters = {
	communityStats: state => state.communityStats
}

export const mutations = {
	setCommunityStats (state, payload) {
		state.communityStats = payload
	}
}

export const actions = {
	fetchCommunityStats ({ commit }) {
		return this.$axios.$get('/community/stats')
			.then((result) => {
				commit('setCommunityStats', result.stats)
				return true
			})
	}
}
