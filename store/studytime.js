const { DateTime } = require('luxon')

export const state = () => ({
	studyTime: null,
	manualsTimelapse: 0.1,	// minutes
	notesTimelapse: 0.1,	// minutes
	testsTimelapse: 0.1		// minutes
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
	addStudyTime ({ state, commit }, scope) {
		const timelapseScope = state[`${scope}Timelapse`]
		const data = {
			date: DateTime.utc().toISO(),
			time_on: scope,
			minutes: timelapseScope
		}
		return this.$axios.$put('/students/studytime', data)
			.then((result) => {
				commit('setStudyTime', result.study_time)
				return true
			})
	}
}
