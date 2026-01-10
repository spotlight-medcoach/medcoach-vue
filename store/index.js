import moment from 'moment';
moment.locale('es');

export const state = () => ({
  token: localStorage.getItem('usertoken'),
  studentInfo: null,
  syllabus: null,
  daysDisabled: [0, 0, 0, 0, 0, 0, 0],
  phase_3_days: 40,
  isFreeTrial: true,
  restDays: null,
  phase: {
    id: null,
    progress: null,
    total: null,
    init_date_phase_2: null,
  },
  alert_second_stage: false,
  landing: 'login',
  showModalImage: false,
  showStudentHeader: true,
  subscriptionPlans: null,
  activeSubscription:
    localStorage.getItem('active_subscription') &&
    localStorage.getItem('active_subscription') === 'true',
});

export const getters = {
  user: (state) => state.studentInfo,
};

export const mutations = {
  setToken (state, token) {
    state.token = token;
  },
  setStudentInfo (state, payload) {
    state.studentInfo = payload;
    if (payload) {
      state.isFreeTrial = payload.is_free_trial;
      state.daysDisabled[payload.free_day] = 1;
    }
  },
  setActiveSubscription (state, payload) {
    if (
      payload.plan_id !== undefined &&
      payload.plan_id !== null &&
      payload.plan_id !== ''
    ) {
      if (payload.active_subscription) {
        state.activeSubscription = true;
      } else {
        state.activeSubscription = false;
      }
    } else {
      state.activeSubscription = true;
    }
  },
  setBearer (state) {
    this.$axios.setToken(state.token, 'Bearer');
  },
  setSyllabus (state, payload) {
    state.syllabus = payload;
  },
  setRestDays (state, payload) {
    state.restDays = payload;
  },
  setPhase (state, payload) {
    state.phase = payload;
  },
  setPhaseID (state, payload) {
    state.phase.id = payload;
  },
  setAlertScondStage (state, payload) {
    state.alert_second_stage = payload;
  },
  setLanding (state, payload) {
    state.landing = payload;
  },
  setShowModalImage (state, payload) {
    state.showModalImage = payload;
  },
  setShowStudentHeader (state, payload) {
    state.showStudentHeader = payload;
  },
  setFreeTrial (state, payload) {
    state.isFreeTrial = payload;
  },
};

export const actions = {
  async initialize ({ commit, dispatch, state }) {
    commit('setBearer');
    commit('http_request/setOnHttpRequest', true);
    await dispatch('fetchStudentInfo'); // necesita obtener la info del estudiante para saber si es free_trial
    const promises = [
      // en todos los casos (sea trial o no)
      dispatch('infographics/fetchInfographics'),
      dispatch('calculeTestLeftDays', state.studentInfo.test_date),
      await dispatch('topics/fetchTopics'),
    ];
    if (state.isFreeTrial) {
      // sólo para free_trial
      const startTrialOn = state.studentInfo.start_free_trial_on;
      promises.concat([
        dispatch('free_trial/calculeTrialLeftDays', startTrialOn),
        await dispatch('payment/fetchSubscriptionPlans'),
      ]);
    } else if (state.phase !== 0) {
      promises.concat([
        // sólo para usuario con suscripción
        dispatch('notifications/loopFetchData'),
        await dispatch('fetchSyllabus'),
      ]);
    }
    // se hace la llamada a todos los recursos previamente definidos
    Promise.all(promises).then(
      () => {
        setTimeout(() => commit('http_request/setOnHttpRequest', false), 1500);
      },
      (error) => {
        dispatch('http_request/errorHttp', error.response);
      },
    );
  },
  killSession ({ commit }) {
    localStorage.removeItem('usertoken');
    commit('setToken', null);
    commit('setStudentInfo', null);
    commit('setBearer');
    const phase = {
      id: null,
      progress: null,
      total: null,
      init_date_phase_2: null,
    };
    commit('setPhase', phase);
  },
  fetchStudentInfo ({ commit }) {
    return this.$axios.$get('/student/profile').then((result) => {
      commit('setStudentInfo', result.student);
      commit('setActiveSubscription', result.student);
    });
  },
  fetchSyllabus ({ commit, dispatch, state }, message) {
    const now = moment();
    let day = now.day() - 1;
    if (day < 0) {
      day = 6;
    }
    const minDay = 0 - day;
    const maxDay = minDay + 6;
    const params = {
      min_index: minDay,
      max_index: maxDay,
      days_disabled: state.daysDisabled,
    };
    return this.$axios
      .$post('/student/syllabus', params)
      .then((result) => {
        commit('setSyllabus', result);
        const phase = {
          id: result.phase,
          progress: result.progress,
          total: result.total,
          init_date_phase_2: result.start_phase_two,
        };
        commit('setPhase', phase);
        // Valido si ya está disponible la segunda fase
        const today = result.days.find((day) => day.index === 0);
        if (!today.manuals.length && day !== state.studentInfo.free_day) {
          commit('setAlertScondStage', true);
        }
        return dispatch('topics/fetchTopics');
      })
      .then((result) => console.log('Topics:', result))
      .catch((error) => {
        console.log('Error en el syllabus', error.response);
      });
  },
  calculeTestLeftDays ({ commit }, testDate) {
    if (testDate) {
      const diffTime = new Date(testDate) - new Date(); // fecha_test - fecha_actual
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const restDays = diffDays < 0 ? 0 : diffDays;
      commit('setRestDays', restDays);
    }
  },
};
