import { prepareTest } from '@/assets/js/helper'

const _simulator = JSON.parse(localStorage.getItem('simulator'))
// const _test = JSON.parse(localStorage.getItem('test'))
// const _simulatorFeedback = JSON.parse(localStorage.getItem('simulator_feedback'))
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
  simulator: _simulator,
  pages: [],
  answers: [],
  timeBlock1: 18060000, // 5 hrs
  timeBlock2: 16260000, //  4.4 hrs,
  test_block_1: [],
  test_block_2: []
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
      if (i === 0) {
        console.log('Questions:', questions)
      }

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
  },
  pages (state) {
    return state.pages
  },
  testBlock1: state => state.test_block_1,
  testBlock2: state => state.test_block_2
}

export const mutations = {
  setBlock (state, payload) {
    state.block = payload
  },
  setSimulator (state, payload) {
    state.simulator = payload
  },
  setPages (state, payload) {
    state.pages = payload
  },
  setAnswer (state, payload) {
    state.pages[payload.page_index].forEach((_case) => {
      _case.questions.forEach((question) => {
        if (question.index === payload.question_index) {
          console.log('Question')
          question.answer = payload.answer
          state.answers[question.index] = payload.answer
          localStorage.setItem('answers', JSON.stringify(state.answers))
        }
      })
    })
  },
  setAnswers (state, payload) {
    state.answers = payload
    let i = 0
    state.pages.forEach((page) => {
      page.forEach((_case) => {
        _case.questions.forEach((question) => {
          question.answer = payload[i]
          i++
        })
      })
    })
    localStorage.setItem('answers', JSON.stringify(payload))
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
  },
  setTestBlock1 (state, payload) {
    state.test_block_1 = payload
  },
  setTestBlock2 (state, payload) {
    state.test_block_2 = payload
  }
}

export const actions = {
  async getRetro ({ commit }, simulatorId) {
    try {
      const cases1 = await this.$axios.get(`/student/simulators/retro?simulator_id=${simulatorId}&type=cases-1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('usertoken')}`
        }
      })

      const cases2 = await this.$axios.get(`/student/simulators/retro?simulator_id=${simulatorId}&type=cases-2`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('usertoken')}`
        }
      })

      const questions = await this.$axios.get(`/student/simulators/retro?simulator_id=${simulatorId}&type=questions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('usertoken')}`
        }
      })

      const simulator = {
        id: simulatorId,
        cases: [...cases1.data.cases, ...cases2.data.cases],
        questions: questions.data.questions
      }

      simulator.questions.forEach((question, index) => {
        question.index = index
      })

      const questionsBlock1 = simulator.questions.slice(0, 280)
      const testBlock1 = prepareTest({ cases: simulator.cases, questions: questionsBlock1 }, true)

      console.log(testBlock1)

      commit('setTestBlock1', testBlock1)
      commit('setSimulator', simulator)
    } catch (err) {
      console.log('Error:', err)
    }

    // return this.$axios.get(`/student/simulators/retro?simulator_id=${simulatorId}`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('usertoken')}`
    //   }
    // }).then((res) => {
    //   const simulator = {
    //     id: simulatorId,
    //     cases: res.data.cases,
    //     questions: res.data.questions
    //   }
    //   simulator.questions.forEach((question, index) => {
    //     question.index = index
    //   })

    //   const questionsBlock1 = simulator.questions.slice(0, 280)
    //   const questionsBlock2 = simulator.questions.slice(280)
    //   const testBlock1 = prepareTest({ cases: simulator.cases, questions: questionsBlock1 }, true)
    //   const testBlock2 = prepareTest({ cases: simulator.cases, questions: questionsBlock2 }, true)

    //   console.log(testBlock1)

    //   // localStorage.setItem('simulator_feedback', JSON.stringify(simulator))
    //   // localStorage.setItem('test_block_1', JSON.stringify(testBlock1))
    //   // localStorage.setItem('test_block_2', JSON.stringify(testBlock2))

    //   commit('setTestBlock1', testBlock1)
    //   commit('setTestBlock2', testBlock2)
    //   commit('setSimulator', simulator)
    // }).catch((err) => {
    //   console.log(err)
    // })
  }
}
