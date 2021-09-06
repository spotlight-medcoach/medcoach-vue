import moment from 'moment'

export const prepareSimulator = (responseAPI, simulatorId) => {
  const { data } = responseAPI
  const simulator = {
    id: simulatorId,
    cases: data.cases,
    questions: data.questions
  }
  const currentBlock = data.current_block
  simulator.questions.forEach((question, index) => {
    question.index = parseInt(index) + (currentBlock === 2 ? 250 : 0)
    question.answer = 0
  })
  localStorage.setItem('session', currentBlock)
  localStorage.setItem('simulator', JSON.stringify(simulator))
  if (currentBlock === 1) {
    localStorage.setItem('start_first_block', moment(data.start_first_block).valueOf())
    localStorage.setItem('start_second_block', null)
    localStorage.setItem('start_break', null)
  } else {
    localStorage.setItem('start_first_block', null)
    localStorage.setItem('start_second_block', moment(data.start_second_block).valueOf())
    localStorage.setItem('start_break', null)
  }

  return simulator
}

export const prepareTest = (simulator) => {
  const maxQuestions = 20
  const pages = []
  const cases = {}
  let cont = 0
  let actualPage = []

  // Agrupación de las preguntas con su caso
  simulator.questions.forEach((question) => {
    if (!cases[question.case_id]) {
      const { id, html } = simulator.cases.find(_case => _case.id === question.case_id)
      cases[question.case_id] = { id, html, questions: [] }
    }
    cases[question.case_id].questions.push(question)
  })

  // Paginación de los casos
  for (const prop in cases) {
    const _case = cases[prop]
    const { questions, id, html } = _case
    const aux = cont + questions.length

    if (aux > maxQuestions) {
      const excess = aux - maxQuestions
      const save = questions.length - excess
      let newQuestions = []

      if (save !== 0) {
        // guardando lo más qu se pueda
        newQuestions = questions.slice(0, save)
        actualPage.push({
          id,
          html,
          questions: newQuestions
        })
      }

      // se agrega una nueva página
      pages.push(actualPage)
      actualPage = []
      newQuestions = questions.slice(save, questions.length)
      actualPage.push({
        id,
        html,
        questions: newQuestions
      })
      cont = excess
    } else {
      actualPage.push(_case)
      cont = aux
    }
  }

  pages.push(actualPage)
  localStorage.setItem('test', JSON.stringify(pages))
  return pages
}
