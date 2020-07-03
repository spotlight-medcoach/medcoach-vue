export const state = () => ({
  token: localStorage.getItem('usertoken'),
  light: '#ffff',
  dark: '#000000',
  sepia: '#fff2b4',
  actualColorBg: '#ffffff',
  actualColorFont: '#000000',
  actualColorBtn: '#fff2b4',
  fontSize: 1,
  themeColors: ['light', 'sepia', 'dark'],
  themeColorIndex: 0,
  themeColor: 'light',
  rest_days: null,
  phase_3_days: 40
})

export const mutations = {
  changeFontSize (state) {
    state.fontSize = state.fontSize + 0.1
    if (state.fontSize >= 1.3) {
      state.fontSize = 1
    }
  },
  changeColorBg (state) {
    if (state.actualColorBg === '#ffffff') {
      state.actualColorBg = '#fff2b4'
      state.actualColorBtn = '#000000'
      state.actualColorFont = '#000000'
    } else if (state.actualColorBg === '#fff2b4') {
      state.actualColorBg = '#000000'
      state.actualColorBtn = '#ffffff'
      state.actualColorFont = '#ffffff'
    } else if (state.actualColorBg === '#000000') {
      state.actualColorBg = '#ffffff'
      state.actualColorBtn = '#fff2b4'
      state.actualColorFont = '#000000'
    }
  },
  setThemeColor (state) {
    let index = state.themeColorIndex
    index = (index + 1) % state.themeColors.length
    state.themeColorIndex = index
    state.themeColor = state.themeColors[index]
  },
  setToken (state, token) {
    state.token = token
  },
  setRestDays (state, days) {
    state.rest_days = days
  }
}

export const actions = {
  changeThemeColor ({ commit }) {
    commit('setThemeColor')
    commit('changeColorBg')
  }
}
