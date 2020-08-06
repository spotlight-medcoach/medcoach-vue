export const state = () => ({
  study_plans: [],
  plan_selected: null
})

export const mutations = {
  setStudyPlans (state, payload) {
    state.study_plans = payload
  },
  setPlanSelected (state, payload) {
    state.plan_selected = payload
  }
}

export const actions = {
  getStudyPlans ({ commit }) {
    return this.$axios.get('/studyplans')
      .then((response) => {
        commit('setStudyPlans', response.data)
        return response
      })
      .catch((error) => {
        return error
      })
  },
  putStudyPlan ({ commit }, plan) {
    commit('setPlanSelected', plan)
    return this.$axios
      .put('/students/studyplan',
        {
          study_plan: plan._id
        }
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        return error
      })
  }
}
