import moment from 'moment'
moment.locale('es')

export const state = () => ({
	totalDuration: 7,
	isTrialEnd: false,
	restDays: 0
})

export const mutations = {
	setIsTrialEnd (state, payload) {
		state.isTrialEnd = payload
	},
	setRestDays (state, payload) {
		state.restDays = payload
	}
}

export const actions = {
	calculeTrialLeftDays ({ commit, state }, startFreeTrialOn) {
		if (startFreeTrialOn) {
			const startTrialOn = new Date(startFreeTrialOn)
			const diffTime = Math.abs(new Date() - startTrialOn)
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
			const isTrialEnd = (diffDays >= state.totalDuration) // los días de free trial no pueden ser mas de 7
			const restDays = isTrialEnd ? state.totalDuration : diffDays // los días de free trial no pueden ser mas de 7
			commit('setIsTrialEnd', isTrialEnd)
			commit('setRestDays', restDays)
		}
	}
}
