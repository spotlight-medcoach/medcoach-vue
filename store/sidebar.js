export const state = () => ({
	sidebar_active: true,
	navigation_enabled: true
})

export const mutations = {
	setSidebarActive (state, payload) {
		state.sidebar_active = payload
	},
	setNavigationEnabled (state, payload) {
		state.navigation_enabled = payload
	}
}

export const getters = {
	sidebarActive: state => state.sidebar_active,
	navigationEnabled: state => state.navigation_enabled
}
