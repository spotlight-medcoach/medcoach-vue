export const state = () => ({
  onHttpRequest: true,
  message: 'Espere un momento, por favor',
  errorHttp: false
})

export const mutations = {
  setMessage (state, message) {
    state.message = message
  },
  setErrorHttp (state, flag) {
    state.errorHttp = flag
  },
  setOnHttpRequest (state, flag) {
    state.onHttpRequest = flag
  }
}

export const actions = {
  initHttpRequest ({ commit }, message = 'Espere un momento, por favor') {
    commit('setOnHttpRequest', true)
    commit('setErrorHttp', false)
    commit('setMessage', message)
  },
  errorHttp ({ commit }, message = 'Lo sentimos, ocurrió un error') {
    commit('setOnHttpRequest', false)
    commit('setErrorHttp', true)
    commit('setMessage', message)
  }
}
