const { DateTime } = require('luxon')

export const state = () => ({
	studyTime: null,
	manualsTimelapse: 10,	// minutes
	notesTimelapse: 10,	// minutes
	testsTimelapse: 10		// minutes
})

export const getters = {
	studyTime: state => state.studyTime,
	manualsTimelapse: state => state.manualsTimelapse,
	notesTimelapse: state => state.notesTimelapse,
	testsTimelapse: state => state.testsTimelapse
}

export const mutations = {
	setStudyTime (state, payload) {
		state.studyTime = payload
	}
}

export const actions = {
	addStudyTime ({ state }, scope) {
		const timelapseScope = state[`${scope}Timelapse`]
		const data = {
			date: DateTime.now().toISODate(),
			time_on: scope,
			minutes: timelapseScope
		}
		return this.$axios.$put('/student/studytime', data)
			.then(() => { return true })
	},
	fetchStudyTime ({ commit }) {
		return this.$axios.$get('/student/studytime')
			.then((result) => {
				commit('setStudyTime', result.study_time)
				return true
			})
	}
}
