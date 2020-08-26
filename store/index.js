import moment from 'moment'
moment.locale('es')

export const state = () => ({
  token: localStorage.getItem('usertoken'),
  studentInfo: null,
  syllabus: null,
  daysDisabled: [0, 0, 0, 0, 0, 0, 0],
  phase_3_days: 40,
  phase: {
    id: null,
    progress: null,
    total: null,
    init_date_phase_2: null
  },
  rest_days: null,
  alert_second_stage: false,
  landing: 'login',
  showModalImage: false
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  },
  setStudentInfo (state, payload) {
    state.studentInfo = payload
    if (payload) {
      state.daysDisabled[payload.free_day] = 1
    }
  },
  setBearer (state) {
    this.$axios.setToken(state.token, 'Bearer')
  },
  setSyllabus (state, payload) {
    state.syllabus = payload
  },
  setRestDays (state, payload) {
    state.rest_days = payload
  },
  setPhase (state, payload) {
    state.phase = payload
  },
  setPaseID (state, payload) {
    state.phase.id = payload
  },
  setAlertScondStage (state, payload) {
    state.alert_second_stage = payload
  },
  setLanding (state, payload) {
    state.landing = payload
  },
  setShowModalImage (state, payload) {
    state.showModalImage = payload
  }
}

export const actions = {
  async initialize ({ commit, dispatch }) {
    commit('setBearer')
    commit('http_request/setOnHttpRequest', true)
    dispatch('notifications/loopFetchData')
    await dispatch('fetchStudentInfo').then(() => dispatch('fetchSyllabus'))
    dispatch('topics/fetchTopics')
  },
  killSession ({ commit }) {
    localStorage.removeItem('usertoken')
    commit('setToken', null)
    commit('setStudentInfo', null)
    commit('setBearer')
    const phase = {
      id: null,
      progress: null,
      total: null,
      init_date_phase_2: null
    }
    commit('setPhase', phase)
  },
  fetchStudentInfo ({ commit }) {
    return this.$axios.$get('/students/info')
      .then((result) => {
        commit('setStudentInfo', result.student)
      })
  },
  fetchSyllabus ({ commit, dispatch, state }, message) {
    dispatch('http_request/initHttpRequest', message)
    const now = moment()
    let day = now.day() - 1
    if (day < 0) {
      day = 6
    }
    const minDay = 0 - day
    const maxDay = minDay + 6
    const params = {
      min_index: minDay,
      max_index: maxDay,
      days_disabled: state.daysDisabled
    }
    return this.$axios.$post('/students/syllabus', params)
      .then((result) => {
        commit('setSyllabus', result)
        const phase = {
          id: result.phase,
          progress: result.progress,
          total: result.total,
          init_date_phase_2: result.start_phase_two
        }
        commit('setPhase', phase)
        // Valido si ya está disponible la segunda fase
        const today = result.days.find(day => day.index === 0)
        if (!today.manuals.length && day !== state.studentInfo.free_day) {
          commit('setAlertScondStage', true)
        }
        commit('http_request/setOnHttpRequest', false)
      })
      .catch((error) => {
        console.log('Error en el syllabus', error.response)
        dispatch('http_request/errorHttp')
      })
  }
}
