import moment from 'moment'
import * as data from '@/components/manuals/manualsData.json'
moment.locale('es')

// Función que sirve para indexar arrays
const keyBy = (arr, key) => arr.reduce((acc, el) => {
  acc[el[key]] = el
  return acc
}, {})

// Inicialización del array de topics
data.topics.forEach((topic) => {
  topic.check = false
  topic.subtopics.forEach((subtopic) => {
    subtopic.check = false
    subtopic.disabled = true
    subtopic.questions = null
    subtopic.topic_id = topic._id
  })
})

// STATE
export const state = () => ({
  topics: data.topics,
  history: null,
  fetchedData: false,
  caseId: null,
  caseIndex: -1,
  customTest: null,
  fetchedTest: false,
  finishedTest: false,
  minutes: 0,
  seconds: 0,
  sendingAnswers: false
})

// GETTERS
export const getters = {
  subtopics (state) {
    let sub = []
    state.topics.forEach((topic) => {
      sub = sub.concat(topic.subtopics)
    })
    return sub
  },
  selectSubtopics (state, getters) {
    const selects = getters.subtopics.filter(sub => sub.check).map((sub) => { return sub._id })
    return selects
  },
  countQuestions (state, getters) {
    let quant = 0
    getters.subtopics.forEach((el) => {
      quant += parseInt(el.questions || 0)
    })
    return quant
  },
  history (state) {
    if (state.history) {
      return state.history.map((el, index, array) => {
        el.index = array.length - index
        return el
      })
    } else {
      return state.history
    }
  },
  caseSelected (state) {
    if (state.caseIndex !== -1 && state.customTest) {
      return state.customTest.cases[state.caseIndex]
    } else {
      return null
    }
  },
  questionsByCase (state) {
    if (state.caseId && state.customTest) {
      return state.customTest.questions.filter(question => question.case_id === state.caseId)
    } else {
      return []
    }
  },
  caseIndex (state) {
    return state.caseIndex
  }
}

// MUTATIONS
export const mutations = {
  setQuestionsSubtopics (state, questions) {
    const keyedQuestions = keyBy(questions, 'subtopic_id')
    state.topics.forEach((topic) => {
      topic.subtopics.forEach((subtopic) => {
        // subtopic.questions = questions.find(q => q.subtopic_id === subtopic._id).count
        subtopic.questions = keyedQuestions[subtopic._id].count
      })
    })
  },
  setFetchedData (state, payload) {
    state.fetchedData = payload
  },
  setHistory (state, payload) {
    state.history = payload
  },
  setCheckTopic (state, payload) {
    const { topicId, value } = payload
    const topicIndex = state.topics.findIndex(topic => topic._id === topicId)
    if (topicIndex !== -1) {
      state.topics[topicIndex].check = value
      state.topics[topicIndex].subtopics.forEach((sub) => {
        sub.disabled = !value
        if (!value) {
          sub.check = false
        }
      })
    }
  },
  setCheckSubtopic (state, payload) {
    const { topicId, subtopicId, value } = payload
    const topicIndex = state.topics.findIndex(topic => topic._id === topicId)
    if (topicIndex !== -1) {
      const topic = state.topics[topicIndex]
      const subtopicIndex = topic.subtopics.findIndex(subtopic => subtopic._id === subtopicId)
      if (subtopicIndex !== -1) {
        topic.subtopics[subtopicIndex].check = value
      }
    }
  },
  setCustomTest (state, payload) {
    state.customTest = payload
    state.customTest.questions.forEach((question, index) => {
      if (question.response === undefined) {
        question.response = question.answer || 0
      }
      question.index = index
    })
  },
  setFetchedTest (state, payload) {
    state.fetchedTest = payload
  },
  setCaseId (state, payload) {
    state.caseId = payload
    state.caseIndex = state.customTest.cases.findIndex(caso => caso.id === state.caseId)
  },
  setQuestionResponse (state, payload) {
    const { index, value } = payload
    state.customTest.questions[index].response = value
    localStorage.setItem(`test_${state.customTest.id}`, JSON.stringify(state.customTest))
  },
  setCaseIndex (state, payload) {
    state.caseIndex = payload
    state.caseId = state.customTest.cases[payload].id
  },
  setFinishedTest (state, payload) {
    state.finishedTest = payload
  },
  setMinutes (state, payload) {
    state.minutes = payload
  },
  setSeconds (state, payload) {
    state.seconds = payload
  },
  initCustomTest (state) {
    state.caseId = null
    state.caseIndex = -1
    state.customTest = null
    state.fetchedTest = false
    state.finishedTest = false
    state.minutes = 0
    state.seconds = 0
  },
  setSendingAnswers (state, payload) {
    state.sendingAnswers = payload
  }
}

// ACTIONS
export const actions = {
  init ({ dispatch, commit }) {
    return dispatch('fetchQuestionsBySubtopic')
      .then((result) => {
        console.log('resultado del fetchQuestionsBySubtopic', result)
        commit('setFetchedData', true)
      })
  },
  fetchQuestionsBySubtopic ({ commit }) {
    return this.$axios.$get('/student/customtest/subtopics')
      .then((result) => {
        commit('setQuestionsSubtopics', result.questions)
      })
      .catch((error) => {
        console.log('Error en el fetchQuestionsBySubtopic', error.response)
      })
  },
  fetchHistory ({ commit }) {
    return this.$axios.$get('/student/customtests')
      .then((result) => {
        commit('setHistory', result.custom_tests)
      })
      .catch((error) => {
        console.log('Error en el fetchHistory', error.response)
      })
  },
  loadCustomTest ({ state, commit, dispatch }, customTest) {
    commit('setCustomTest', customTest)
    if (state.customTest.by_time) {
      if (dispatch('prepareTimeTest')) {
        commit('setFetchedTest', true)
      }
    } else {
      commit('setFetchedTest', true)
    }
  },
  fetchCustomTest ({ state, commit, dispatch }, customTestId) {
    return this.$axios.$get(`/student/customtest?custom_test_id=${customTestId}`)
      .then((result) => {
        localStorage.setItem(`test_${customTestId}`, JSON.stringify(result.custom_test))
        dispatch('loadCustomTest', result.custom_test)
      })
      .catch((error) => {
        alert('Error en el fetchCustomTest')
        console.log('Error en el fetchCustomTest', error)
      })
  },
  fetchCustomTestRetro ({ commit }, customTestId) {
    return this.$axios.$get(`/student/customtest/retro?custom_test_id=${customTestId}`)
      .then((result) => {
        commit('setCustomTest', result.custom_test)
        commit('setFetchedTest', true)
      })
      .catch((error) => {
        alert('Error en el fetchCustomTest')
        console.log('Error en el fetchCustomTest', error.response)
      })
  },
  prepareTimeTest ({ state, dispatch }) {
    const time = state.customTest.total_time
    const finish = moment(state.customTest.start_at)
    finish.add(time, 's')
    if (moment().isAfter(finish)) {
      dispatch('finishTest')
      return false
    } else {
      const duration = moment.duration(finish.diff(moment()))
      const restTime = duration.asSeconds()
      dispatch('initCountdown', duration)
      setTimeout(() => {
        if (!state.finishedTest) {
          dispatch('finishTest')
        }
      }, 1000 * restTime)
      return true
    }
  },
  finishTest ({ state, dispatch, commit }) {
    return dispatch('sendAnswers').then(() => {
      commit('setFinishedTest', true)
      this.$router.push('/custom_test_config')
    })
  },
  prevCase ({ state, commit }) {
    if (state.caseIndex > 0) {
      commit('setCaseIndex', state.caseIndex - 1)
    }
  },
  nextCase ({ state, commit }) {
    if (state.caseIndex < state.customTest.cases.length - 1) {
      commit('setCaseIndex', state.caseIndex + 1)
    }
  },
  sendAnswers ({ state, commit }) {
    const _ans = state.customTest.questions.map((question) => {
      return question.response
    })
    const params = { answers: _ans }
    commit('setSendingAnswers', true)
    return this.$axios.$post(`/student/customtest/answers?custom_test_id=${state.customTest.id}`, params)
      .then((response) => {
        localStorage.removeItem(`test_${state.customTest.id}`)
        return response
      })
      .catch((error) => {
        return error
      })
      .finally(() => {
        commit('setSendingAnswers', false)
      })
  },
  initCountdown ({ commit }, duration) {
    const interval = 1
    const timer = setInterval(() => {
      duration = moment.duration(duration.asSeconds() - interval, 'seconds')
      let min = duration.minutes()
      let sec = duration.seconds()
      sec -= 1
      if (parseInt(min) < 0) {
        return clearInterval(timer)
      }
      if (parseInt(min) < 10 && min.length !== 2) {
        min = '0' + min
      }
      if (parseInt(sec) < 0 && parseInt(min) !== 0) {
        min -= 1
        sec = 59
      } else if (parseInt(sec) < 10 && sec.length !== 2) {
        sec = '0' + sec
      }
      commit('setMinutes', min)
      commit('setSeconds', sec)
      if (parseInt(min) === 0 && parseInt(sec) === 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
}
