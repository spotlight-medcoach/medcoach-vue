const screenTypes = {
  login: 'login',
  recoveryPassword: 'recovery-password'
}

export const state = () => ({
  screen: screenTypes.login
})

export const mutations = {
  setScreen (state, payload) {
    state.screen = payload
  }
}

export const getters = {
  screen: state => state.screen
}
