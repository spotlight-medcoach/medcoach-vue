export const state = () => ({
  study_plans: [],
  plan_selected: null,
});

export const mutations = {
  setStudyPlans (state, payload) {
    state.study_plans = payload;
  },
  setPlanSelected (state, payload) {
    state.plan_selected = payload;
  },
};

export const actions = {
  getStudyPlans ({ commit }) {
    return this.$axios
      .get('/catalogues/study-plans')
      .then((response) => {
        // La respuesta puede estar en response.data.data (si viene envuelta) o directamente en response.data
        const responseData = response.data.data || response.data;
        commit('setStudyPlans', responseData);
        return response;
      })
      .catch((error) => {
        return error;
      });
  },
  putStudyPlan ({ commit }, plan) {
    commit('setPlanSelected', plan);
    return this.$axios
      .put('/student/profile/study-plan', {
        study_plan: plan._id,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  },
};
