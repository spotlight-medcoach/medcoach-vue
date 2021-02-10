const _simulator = JSON.parse(localStorage.getItem('simulator'))
const _simulatorFeedback = JSON.parse(localStorage.getItem('simulator_feedback'))
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
  questionsPerPage: 20,
  simulator: _simulator || _simulatorFeedback,
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
  },
  test (state) {
    const maxQuestions = state.questionsPerPage
    const totalCases = state.simulator.cases.length
    const pages = []
    let cont = 0
    let actualPage = []

    for (let i = 0; i < totalCases; i++) {
      const _case = state.simulator.cases[i]
      const questions = state.simulator.questions.filter(question => question.case_id === _case.id)

      if (questions.length === 0) {
        continue
      }

      const aux = cont + questions.length

      if (aux > maxQuestions) {
        const excess = aux - maxQuestions
        const save = questions.length - excess

        // guardando lo más qu se pueda
        let newQuestions = questions.slice(0, save)
        actualPage.push({
          id: _case.id,
          html: _case.html,
          questions: newQuestions
        })
        pages.push(actualPage)

        // se agrega una nueva página
        actualPage = []
        newQuestions = questions.slice(save, questions.length)
        actualPage.push({
          id: _case.id,
          html: _case.html,
          questions: newQuestions
        })
        cont = excess
      } else {
        actualPage.push({
          id: _case.id,
          html: _case.html,
          questions: _case.questions
        })
        cont = aux
      }
    }
    pages.push(actualPage)
    return pages
  },
  questions (state) {
    return state.simulator.questions
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
  },
  initState (state) {
    state.caseId = null
    state.caseIndex = -1
    state.simulator = null
    state.block = 1
  }
}
