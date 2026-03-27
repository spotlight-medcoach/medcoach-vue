export const state = () => ({
  overview: null,
  studyHoursDaily: [],
  questionsBank: null,
  questionsByCategory: [],
  medscoreDistribution: null,
  manualsByTopic: [],
  loading: false,
  error: null,
});

export const getters = {
  overview: (state) => state.overview,
  studyHoursDaily: (state) => state.studyHoursDaily,
  questionsBank: (state) => state.questionsBank,
  questionsByCategory: (state) => state.questionsByCategory,
  medscoreDistribution: (state) => state.medscoreDistribution,
  manualsByTopic: (state) => state.manualsByTopic,
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
  setMedscoreDistribution (state, value) {
    state.medscoreDistribution = value;
  },
  setManualsByTopic (state, value) {
    state.manualsByTopic = value;
  },
};

export const actions = {
  async fetchAnalytics ({ commit }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const [overviewResult, studyResult, bankResult, categoryResult, distResult, manualsResult] = await Promise.all([
        this.$axios.$get('/student/analytics/overview'),
        this.$axios.$get('/student/analytics/study-hours-daily'),
        this.$axios.$get('/student/analytics/questions-bank'),
        this.$axios.$get('/student/analytics/questions-by-category'),
        this.$axios.$get('/student/analytics/medscore-distribution'),
        this.$axios.$get('/student/analytics/manuals-by-topic'),
      ]);

      const overviewData = overviewResult?.data || overviewResult || {};
      const studyData = studyResult?.data || studyResult || {};
      const bankData = bankResult?.data || bankResult || {};
      const categoryData = categoryResult?.data || categoryResult || {};
      const distData = distResult?.data || distResult || null;
      const manualsData = manualsResult?.data || manualsResult || {};

      commit('setOverview', overviewData);
      commit('setStudyHoursDaily', studyData.days || []);
      commit('setQuestionsBank', bankData);
      commit('setQuestionsByCategory', categoryData.categories || []);
      commit('setMedscoreDistribution', distData);
      commit('setManualsByTopic', manualsData.topics || []);
      return true;
    } catch (error) {
      commit('setError', error?.response?.data?.error || 'No fue posible cargar los analíticos');
      return false;
    } finally {
      commit('setLoading', false);
    }
  },
};
