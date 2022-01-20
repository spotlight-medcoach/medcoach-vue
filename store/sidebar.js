export const state = () => ({
  sidebar_active: true
})

export const mutations = {
  setSidebarActive (state, payload) {
    state.sidebar_active = payload
  }
}

export const getters = {
  sidebarActive: state => state.sidebar_active
}
