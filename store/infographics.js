const storage = process.env.STORAGE_BASE_URL

export const state = () => ({
	infographics: undefined,
	studentInfographics: undefined,
	loadingState: false
})

export const getters = {
	allInfographics: state => state.infographics,
	studentInfographics: state => state.studentInfographics,
	loadingState: state => state.loadingState
}

export const mutations = {
	setLoadingState (state, loadingState) {
		state.loadingState = loadingState
	},
	setInfographics (state, infographics) {
		state.infographics = infographics
	},
	setStudentInfographics (state, studentInfographics) {
		state.studentInfographics = studentInfographics
	},
	addInfographic (state, infographic) {
		state.infographics.unshift(infographic)
	},
	addStudentInfographic (state, studentInfographic) {
		state.studentInfographics.push(studentInfographic)
	},
	removeInfographic (state, infographicId) {
		const idx = state.infographics.findIndex(infographic => infographic._id === infographicId)
		state.infographics.splice(idx, 1)
	},
	sendInfographicToLast (state, infographicId) {
		const infographicIdx = state.infographics.findIndex(infographic => infographic._id === infographicId)
		const infographic = state.infographics[infographicIdx]
		state.infographics.splice(infographicIdx, 1)
		state.infographics.push(infographic)
	},
	markInfographicAsLearned (state, infographicId) {
		const infographicIdx = state.infographics.findIndex(infographic => infographic._id === infographicId)
		state.infographics[infographicIdx].learned = true
	}
}

export const actions = {
	fetchInfographics ({ commit }) {
		commit('setLoadingState', true)
		return Promise.all([
			this.$axios.get('http://localhost:3000/api/infographics'),
			this.$axios.get('http://localhost:3000/api/student/infographics')
		])
			.then(([infographicsResponse, StudentInfographicsResponse]) => {
				const studentInfographics = StudentInfographicsResponse.data.studentInfographics
				commit('setStudentInfographics', studentInfographics)
				const allInfographics = infographicsResponse.data.infographics
				commit('setInfographics', allInfographics
					.map((infographic) => {
						infographic.image = storage + '/infographics/' + infographic.image
						infographic.learned = studentInfographics.some(
							studentInfographic => studentInfographic.infographic_id === infographic._id
						)
						return infographic
					})
					.sort((infA, infB) => {
						return infA.learned - infB.learned
					})
				)
				return true
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
	},
	setInfographicToStudent ({ commit }, infographicId) {
		commit('setLoadingState', true)
		return this.$axios
			.post('http://localhost:3000/api/student/infographic', { infographic_id: infographicId })
			.then((sudentInfographic) => {
				commit('addStudentInfographic', sudentInfographic)
				commit('markInfographicAsLearned', infographicId)
				commit('sendInfographicToLast', infographicId)
				return sudentInfographic
			})
			.catch((error) => {
				return error
			})
			.finally(() => {
				commit('setLoadingState', false)
			})
	}
}
