import * as data from '@/components/manuals/manualsData.json'

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
  fetchedTest: false
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
    return state.history
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
    state.history = payload.map((el, index) => {
      el.index = index
      return el
    }).reverse()
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
      question.response = 0
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
  },
  setCaseIndex (state, payload) {
    state.caseIndex = payload
    state.caseId = state.customTest.cases[payload].id
  }
}

// ACTIONS
export const actions = {
  init ({ dispatch, commit }) {
    return dispatch('fetchQuestionsBySubtopic')
      .then((result) => {
        console.log('resultado del fetchQuestionsBySubtopic', result)
        dispatch('fetchHistory').then(() => commit('setFetchedData', true))
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
  fetchCustomTest ({ commit }, customTestId) {
    return this.$axios.$get(`/student/customtest?custom_test_id=${customTestId}`)
      .then((result) => {
        commit('setCustomTest', result.custom_test)
        commit('setFetchedTest', true)
      })
      .catch((error) => {
        alert('Error en el fetchCustomTest')
        console.log('Error en el fetchCustomTest', error.response)
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
    return this.$axios.$post(`/student/customtest/answers?custom_test_id=${state.customTest.id}`, params)
      .then((response) => {
        return response
      })
      .catch((error) => {
        return error
      })
  }
}
