import * as data from '@/components/manuals/manualsData.json'
const initTopic = data.topics[0]
const initSubtopic = initTopic.subtopics[0]

function sortManuals (a, b) {
  if (a.manual_name > b.manual_name) {
    return 1
  }
  if (a.manual_name < b.manual_name) {
    return -1
  }
  return 0
}

function removeAccents (cadena) {
  const acentos = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' }
  return cadena.split('').map(letra => acentos[letra] || letra).join('').toString()
}

export const state = () => ({
  data: data.topics,
  topic_index: 0,
  subtopic_index: 0,
  topic: initTopic,
  subtopic: initSubtopic,
  fetchedManuals: false,
  manuals: []
})

export const mutations = {
  setTopic (state, index) {
    state.topic_index = index
    state.topic = state.data[index]
    state.subtopic_index = 0
    state.subtopic = state.topic.subtopics[0]
  },
  setTopics (state, topics) {
    const manualsArray = []
    state.data.forEach((topic, index) => {
      const auxTopic = topics.find(e => e.id === topic._id)
      topic.progress = auxTopic.progress
      topic.total = auxTopic.total
      topic.subtopics.forEach((subtopic, indexSub) => {
        if (auxTopic.subtopics[indexSub] === undefined) {
          console.clear()
          console.log('subtopics', auxTopic.subtopics)
          console.log('index', indexSub)
          console.log('obj', subtopic)
        }
        subtopic.manuals = auxTopic.subtopics[indexSub].manuals
        console.log()
        subtopic.manuals.forEach((manual) => {
          const obj = {
            manual_id: manual.id,
            manual_name: manual.name,
            subtopic_name: subtopic.name,
            topic_name: topic.name,
            finished: manual.finished,
            low_manual: removeAccents(manual.name.toLowerCase()),
            low_subtopic: removeAccents(subtopic.name.toLowerCase()),
            low_topic: removeAccents(topic.name.toLowerCase())
          }
          manualsArray.push(obj)
        })
      })
    })
    manualsArray.sort(sortManuals)
    state.manuals = manualsArray
    state.fetchedManuals = true
  },
  setSubtopic (state, index) {
    state.subtopic_index = index
    state.subtopic = state.topic.subtopics[index]
  },
  setFetchedManuals (state, value) {
    state.fetchedManuals = value
  }
}

export const actions = {
  fetchTopics ({ commit }) {
    return this.$axios
      .get('/topics')
      .then((res) => {
        const allManuals = res.data.topics
        commit('setTopics', allManuals)
        return true
      })
  },
  changeTopic ({ commit }, index) {
    commit('setTopic', index)
  },
  changeSubtopic ({ commit }, index) {
    commit('setSubtopic', index)
  }
}
