
export const state = () => ({
	promotedPlanId: '1',
	subscriptionPlans: [],
	promotedPlan: undefined,
	conektaFrameTokenId: undefined,
	conektaCheckoutId: undefined
})

export const getters = {
	subscriptionPlans: state => state.subscriptionPlans
}

export const mutations = {
	setSubscriptionPlans (state, payload) {
		state.subscriptionPlans = payload
	},
	setPromotedPlan (state, payload) {
		state.promotedPlan = payload
	},
	setFrameTokenId (state, payload) {
		state.conektaFrameTokenId = payload
	},
	setCheckoutId (state, payload) {
		state.conektaCheckoutId = payload
	}
}

export const actions = {
	fetchSubscriptionPlans ({ commit, state }) {
		return this.$axios.$get('/subscription/plans')
			.then((result) => {
				const plans = result.plans.map((plan) => {
					plan.amount = parseFloat(plan.amount / 100).toFixed(2)
					if (plan.id === state.promotedPlanId) {
						commit('setPromotedPlan', plan)
					}
					return plan
				})
				commit('setSubscriptionPlans', plans)
				return true
			})
	},
	createConektaNullToken ({ commit }) {
		const payload = { checkout: { returns_control_on: 'Token' } }
		const config = {
			headers: {
				Accept: 'application/vnd.conekta-v2.0.0+json',
				Authorization: `Bearer ${process.env.CONEKTA_PUBLIC_KEY}`,
				'Content-Type': 'application/json',
				'Accept-Language': 'es'
			}
		}
		return this.$axios.post('https://api.conekta.io/tokens', payload, config)
			.then((result) => {
				commit('setFrameTokenId', result.data.id)
				commit('setCheckoutId', result.data.checkout.id)
				return result.data.checkout.id
			})
	},
	createChekoutRequest ({ commit }, payload) {
		return this.$axios.$post('/students/checkout', payload)
			.then((result) => {
				commit('setCheckoutId', result.id)
				return result.id
			})
	},
	registerSubscription ({ state }, payload) {
		return this.$axios.$post('/students/subscription', payload)
	}
}
