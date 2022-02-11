const storage = process.env.STORAGE_BASE_URL

export const state = () => ({
	infographics: undefined,
	loadingState: false
})

export const getters = {
	allInfographics: state => state.infographics,
	loadingState: state => state.loadingState
}

export const mutations = {
	setLoadingState (state, loadingState) {
		state.loadingState = loadingState
	},
	setInfographics (state, infographics) {
		state.infographics = infographics
	},
	addInfographic (state, infographic) {
		state.infographics.unshift(infographic)
	},
	removeInfographic (state, infographicId) {
		const idx = state.infographics.findIndex(infographic => infographic._id === infographicId)
		state.infographics.splice(idx, 1)
	}
}

export const actions = {
	fetchInfographics ({ commit }) {
		commit('setLoadingState', true)
		return this.$axios.get('http://localhost:3000/api/infographics')
			.then((response) => {
				commit('setInfographics', response.data.infographics.map(
					(infographic) => {
						infographic.image = storage + '/infographics/' + infographic.image
						return infographic
					}
				))
				return response
			})
			.catch((error) => {
				return error
			})
			.finally(() => {
				commit('setLoadingState', false)
			})
	},
	createInfographic ({ commit }, infographic) {
		commit('setLoadingState', true)
		return this.$axios
			.post('http://localhost:3000/api/infographic',
				infographic
			)
			.then((response) => {
				const newInfographic = response.data
				newInfographic.image = storage + '/infographics/' + newInfographic.image
				commit('addInfographic', newInfographic)
				return newInfographic
			})
			.catch((error) => {
				return error
			})
			.finally(() => {
				commit('setLoadingState', false)
			})
	},
	deleteInfographic ({ commit }, infographicId) {
		commit('setLoadingState', true)
		return this.$axios
			.delete('http://localhost:3000/api/infographic',
				{ data: { infographic_id: infographicId } }
			)
			.then((response) => {
				commit('removeInfographic', infographicId)
				return response
			})
			.catch((error) => {
				return error
			})
			.finally(() => {
				commit('setLoadingState', false)
			})
	}
}
