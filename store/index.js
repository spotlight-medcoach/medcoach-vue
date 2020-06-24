export const state = () => ({
  light: '#ffff',
  dark: '#000000',
  sepia: '#fff2b4',
  actualColorBg: '#ffffff',
  actualColorFont: '#000000',
  actualColorBtn: '#fff2b4',
  fontSize: 1
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
  }
}
