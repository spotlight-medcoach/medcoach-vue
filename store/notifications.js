import moment from 'moment'
moment.locale('es')

export const state = () => ({
  data: [],
  minutes: 10
})

export const mutations = {
  setData (state, payload) {
    const data = payload.map((element) => {
      element.date = moment(element.date).format('DD/MM/YYYY')
      return element
    })
    state.data = data
  },
  setReadNotification (state, notificationID) {
    const index = state.data.map((element) => {
      return element.id
    }).indexOf(notificationID)
    if (index !== -1) {
      state.data[index].readed = true
    }
  }
}

export const getters = {
  // Regresa true si hay mensajes sin leer
  alertNotifications (state) {
    return state.data.some(element => !element.readed)
  }
}

export const actions = {
  fetchNotifications ({ commit }) {
    return this.$axios.$get('/student/notifications')
      .then((result) => {
        commit('setData', result.notifications)
      })
  },
  // Hace un loop para actualizar las notificaciones cada n minutos
  loopFetchData ({ state, dispatch }) {
    dispatch('fetchNotifications')
    setTimeout(() => {
      dispatch('loopFetchData')
    }, state.minutes * 60000)
  },
  readNotification ({ commit }, notificationID) {
    return this.$axios.$post(`/student/notifications?notification_id=${notificationID}`)
      .then((response) => {
        console.log('read notification', response)
        commit('setReadNotification', notificationID)
      })
  }
}
