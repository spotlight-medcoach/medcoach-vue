export const state = () => ({
  overview: null,
  studyHoursDaily: [],
  questionsBank: null,
  questionsByCategory: [],
  loading: false,
  error: null,
});

export const getters = {
  overview: (state) => state.overview,
  studyHoursDaily: (state) => state.studyHoursDaily,
  questionsBank: (state) => state.questionsBank,
  questionsByCategory: (state) => state.questionsByCategory,
  loading: (state) => state.loading,
  error: (state) => state.error,
};

export const mutations = {
  setLoading (state, value) {
    state.loading = value;
  },
  setError (state, value) {
    state.error = value;
  },
  setOverview (state, value) {
    state.overview = value;
  },
  setStudyHoursDaily (state, value) {
    state.studyHoursDaily = value;
  },
  setQuestionsBank (state, value) {
    state.questionsBank = value;
  },
  setQuestionsByCategory (state, value) {
    state.questionsByCategory = value;
  },
};

export const actions = {
  async fetchAnalytics ({ commit }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const [overviewResult, studyResult, bankResult, categoryResult] = await Promise.all([
        this.$axios.$get('/student/analytics/overview'),
        this.$axios.$get('/student/analytics/study-hours-daily'),
        this.$axios.$get('/student/analytics/questions-bank'),
        this.$axios.$get('/student/analytics/questions-by-category'),
      ]);

      const overviewData = overviewResult?.data || overviewResult || {};
      const studyData = studyResult?.data || studyResult || {};
      const bankData = bankResult?.data || bankResult || {};
      const categoryData = categoryResult?.data || categoryResult || {};

      commit('setOverview', overviewData);
      commit('setStudyHoursDaily', studyData.days || []);
      commit('setQuestionsBank', bankData);
      commit('setQuestionsByCategory', categoryData.categories || []);
      return true;
    } catch (error) {
      commit('setError', error?.response?.data?.error || 'No fue posible cargar los analíticos');
      return false;
    } finally {
      commit('setLoading', false);
    }
  },
};
