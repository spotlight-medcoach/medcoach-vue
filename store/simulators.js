const _simulator = JSON.parse(localStorage.getItem('simulator'))
const _answersStorage = localStorage.getItem('answers')
let _answers = []
if (_answersStorage !== null) {
  _answers = _answersStorage.split(',')
}
if (_simulator !== null) {
  _simulator.questions.forEach((question, index) => {
    question.answer = _answers[index]
  })
}
export const state = () => ({
  block: 1,
  caseId: null,
  caseIndex: -1,
  simulator: _simulator,
  timeBlock1: 18060000, // 5 hrs
  timeBlock2: 16260000 //  4.4 hrs
})

export const getters = {
  caseSelected (state) {
    if (state.caseIndex !== -1 && state.simulator) {
      return state.simulator.cases[state.caseIndex]
    } else {
      return null
    }
  },
  questionsByCase (state) {
    if (state.caseId && state.simulator) {
      return state.simulator.questions.filter(question => question.case_id === state.caseId)
    } else {
      return []
    }
  }
}

export const mutations = {
  setBlock (state, payload) {
    state.block = payload
  },
  setSimulator (state, payload) {
    state.simulator = payload
  },
  setCaseIndex (state, payload) {
    state.caseIndex = payload
    state.caseId = state.simulator.cases[payload].id
  },
  setCaseId (state, payload) {
    state.caseId = payload
    state.caseIndex = state.simulator.cases.findIndex(caso => caso.id === state.caseId)
  },
  setQuestionResponse (state, payload) {
    const { index, value } = payload
    state.simulator.questions[index].answer = value
    localStorage.setItem(`test_${state.simulator.id}`, JSON.stringify(state.simulator))
  }
}
