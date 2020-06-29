import * as data from '@/components/manuals/manualsData.json'
const initTopic = data.topics[0]
const initSubtopic = initTopic.subtopics[0]

export const state = () => ({
  data: data.topics,
  topic_index: 0,
  subtopic_index: 0,
  topic: initTopic,
  subtopic: initSubtopic,
  fetchedManuals: false
})

export const mutations = {
  setTopic (state, index) {
    state.topic_index = index
    state.topic = state.data[index]
    state.subtopic_index = 0
    state.subtopic = state.topic.subtopics[0]
  },
  setTopics (state, topics) {
    state.data.forEach((topic, index) => {
      const auxTopic = topics[index]
      topic.progress = auxTopic.progress
      topic.total = auxTopic.total
      topic.subtopics.forEach((subtopic, indexSub) => {
        subtopic.manuals = auxTopic.subtopics[indexSub].manuals
      })
    })
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
  changeTopic ({ commit }, index) {
    commit('setTopic', index)
  },
  changeSubtopic ({ commit }, index) {
    commit('setSubtopic', index)
  }
}
