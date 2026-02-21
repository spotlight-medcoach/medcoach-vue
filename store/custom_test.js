import moment from 'moment';
import * as data from '@/components/manuals/manualsData.json';
moment.locale('es');

// Función que sirve para indexar arrays
const keyBy = (arr, key) =>
  arr.reduce((acc, el) => {
    acc[el[key]] = el;
    return acc;
  }, {});

// Inicialización del array de topics
data.topics.forEach((topic) => {
  topic.check = false;
  topic.subtopics.forEach((subtopic) => {
    subtopic.check = false;
    subtopic.disabled = true;
    subtopic.questions = null;
    subtopic.questions_not_answered = null;
    subtopic.topic_id = topic._id;
  });
});

// Debounce for persisting to localStorage when only time updates (every second)
const PERSIST_DEBOUNCE_MS = 3000;
let persistTimeTimeout = null;

function schedulePersist (state) {
  if (persistTimeTimeout) {
    clearTimeout(persistTimeTimeout);
  }
  persistTimeTimeout = setTimeout(() => {
    if (state.customTest) {
      localStorage.setItem(
        `test_${state.customTest.id}`,
        JSON.stringify(state.customTest),
      );
    }
    persistTimeTimeout = null;
  }, PERSIST_DEBOUNCE_MS);
}

function clearPersistTimeout () {
  if (persistTimeTimeout) {
    clearTimeout(persistTimeTimeout);
    persistTimeTimeout = null;
  }
}

function doFlushPersist (state) {
  clearPersistTimeout();
  if (state.customTest) {
    localStorage.setItem(
      `test_${state.customTest.id}`,
      JSON.stringify(state.customTest),
    );
  }
}

// STATE
export const state = () => ({
  topics: data.topics,
  history: null,
  fetchedData: false,
  caseId: null,
  caseIndex: -1,
  customTest: null,
  fetchedTest: false,
  finishedTest: false,
  sendingAnswers: false,
  type: '',
  timer: null,
  timerString: '',
  selectedQuestion: null,
});

// GETTERS
export const getters = {
  subtopics (state) {
    let sub = [];
    state.topics.forEach((topic) => {
      sub = sub.concat(topic.subtopics);
    });
    return sub;
  },
  selectSubtopics (state, getters) {
    const selects = getters.subtopics
      .filter((sub) => sub.check)
      .map((sub) => {
        return sub._id;
      });
    return selects;
  },
  countQuestions (state, getters) {
    let quant = 0;
    if (state.type !== '') {
      if (state.type === 'all') {
        getters.subtopics.forEach((el) => {
          quant += parseInt(el.questions || 0);
        });
      } else if (state.type === 'not_answered') {
        getters.subtopics.forEach((el) => {
          quant += parseInt(el.questions_not_answered || 0);
        });
      }
    }
    return quant;
  },
  history (state) {
    if (state.history) {
      return state.history.map((el, index, array) => {
        el.index = array.length - index;
        return el;
      });
    } else {
      return state.history;
    }
  },
  caseSelected (state) {
    if (state.caseIndex !== -1 && state.customTest) {
      return state.customTest.cases[state.caseIndex];
    } else {
      return null;
    }
  },
  questionsByCase (state) {
    if (state.caseId && state.customTest) {
      return state.customTest.questions.filter(
        (question) => question.case_id === state.caseId,
      );
    } else {
      return [];
    }
  },
  caseIndex (state) {
    return state.caseIndex;
  },
  correctAnswers (state) {
    let correct = 0;
    if (
      state.customTest &&
      state.customTest.questions &&
      state.customTest.questions.length
    ) {
      state.customTest.questions.forEach((question) => {
        if (question.response === question.correct_answer) {
          correct++;
        }
      });
    }
    return correct;
  },
  testGrade (state, getters) {
    let grade = 0;
    if (
      state.customTest &&
      state.customTest.questions &&
      state.customTest.questions.length
    ) {
      grade =
        (getters.correctAnswers / state.customTest.questions.length) * 100;
    }
    return grade.toFixed(2);
  },
  selectedQuestion (state) {
    return state.selectedQuestion;
  },
};

// MUTATIONS
export const mutations = {
  setQuestionsSubtopics (state, questions) {
    const keyedQuestions = keyBy(questions, 'subtopic_id');
    state.topics.forEach((topic) => {
      topic.subtopics.forEach((subtopic) => {
        // subtopic.questions = questions.find(q => q.subtopic_id === subtopic._id).count
        subtopic.questions = keyedQuestions[subtopic._id].count;
        subtopic.questions_not_answered =
          keyedQuestions[subtopic._id].count_not_answered;
        subtopic.questions_incorrect =
          keyedQuestions[subtopic._id].count_incorrect;
        subtopic.questions_correct = keyedQuestions[subtopic._id].count_correct;
      });
    });
  },
  setFetchedData (state, payload) {
    state.fetchedData = payload;
  },
  setHistory (state, payload) {
    state.history = payload;
  },
  setCheckTopic (state, payload) {
    const { topicId, value } = payload;
    const topicIndex = state.topics.findIndex((topic) => topic._id === topicId);
    if (topicIndex !== -1) {
      state.topics[topicIndex].check = value;
      state.topics[topicIndex].subtopics.forEach((sub) => {
        sub.disabled = !value;
        if (!value) {
          sub.check = false;
        }
      });
    }
  },
  setCheckSubtopic (state, payload) {
    const { topicId, subtopicId, value } = payload;
    const topicIndex = state.topics.findIndex((topic) => topic._id === topicId);
    if (topicIndex !== -1) {
      const topic = state.topics[topicIndex];
      const subtopicIndex = topic.subtopics.findIndex(
        (subtopic) => subtopic._id === subtopicId,
      );
      if (subtopicIndex !== -1) {
        topic.subtopics[subtopicIndex].check = value;
      }
    }
  },
  setCustomTest (state, payload) {
    state.customTest = payload;
    state.customTest.questions = state.customTest.questions.map(
      (question, index) => {
        if (question.response === undefined) {
          // -1 means no option selected; only use existing answer if it's a valid option index (>= 0)
          question.response =
            question.answer !== undefined && question.answer >= 0
              ? question.answer
              : -1;
        }
        if (question.marked === undefined) {
          question.marked = false;
        }
        if (question.time === undefined) {
          question.time = 0;
        }
        if (question.first_answer === undefined) {
          question.first_answer = -1;
        }
        question.index = index;
        return question;
      },
    );
  },
  setFetchedTest (state, payload) {
    state.fetchedTest = payload;
  },
  setCaseId (state, payload) {
    state.caseId = payload;
    state.caseIndex = state.customTest.cases.findIndex(
      (caso) => caso.id === state.caseId,
    );
  },
  setQuestionResponse (state, payload) {
    const { index, value } = payload;
    if (state.customTest.questions[index].first_answer === -1) {
      state.customTest.questions[index].first_answer = value;
    }
    state.customTest.questions[index].response = value;
    localStorage.setItem(
      `test_${state.customTest.id}`,
      JSON.stringify(state.customTest),
    );
  },
  setQuestionMark (state, payload) {
    const { index, value } = payload;
    state.customTest.questions[index].marked = value;
    localStorage.setItem(
      `test_${state.customTest.id}`,
      JSON.stringify(state.customTest),
    );
  },
  setQuestionTime (state, payload) {
    const { index, value } = payload;
    state.customTest.questions[index].time = value;
    // Debounce localStorage write (timer ticks every second; avoid overwriting constantly)
    schedulePersist(state);
  },
  flushPersistToStorage (state) {
    doFlushPersist(state);
  },
  setCaseIndex (state, payload) {
    state.caseIndex = payload;
    state.caseId = state.customTest.cases[payload].id;
  },
  setFinishedTest (state, payload) {
    state.finishedTest = payload;
  },
  setMinutes (state, payload) {
    state.minutes = payload;
  },
  setSeconds (state, payload) {
    state.seconds = payload;
  },
  initCustomTest (state) {
    clearPersistTimeout();
    state.caseId = null;
    state.caseIndex = -1;
    state.customTest = null;
    state.fetchedTest = false;
    state.finishedTest = false;
    state.minutes = 0;
    state.seconds = 0;
  },
  setSendingAnswers (state, payload) {
    state.sendingAnswers = payload;
  },
  setType (state, payload) {
    state.type = payload;
  },
  setTimer (state, payload) {
    state.timer = payload;
  },
  setTimerString (state, payload) {
    state.timerString = payload;
  },
  RESET_TOPICS (state) {
    data.topics.forEach((topic) => {
      topic.check = false;
      topic.subtopics.forEach((subtopic) => {
        subtopic.check = false;
        subtopic.disabled = true;
        subtopic.questions = null;
        subtopic.questions_not_answered = null;
        subtopic.topic_id = topic._id;
      });
    });
    state.topics = data.topics;
  },
  setSelectedQuestion (state, payload) {
    state.selectedQuestion = payload;
    state.caseId = payload?.case_id || null;
    if (state.caseId && state.customTest?.cases?.length) {
      state.caseIndex = state.customTest.cases.findIndex(
        (caso) => caso.id === state.caseId,
      );
    } else {
      state.caseIndex = -1;
    }
  },
};

// ACTIONS
export const actions = {
  init ({ dispatch, commit }) {
    return dispatch('fetchQuestionsBySubtopic').then((result) => {
      console.log('resultado del fetchQuestionsBySubtopic', result);
      commit('setFetchedData', true);
    });
  },
  fetchQuestionsBySubtopic ({ commit }) {
    return this.$axios
      .$get('/student/custom-tests/subtopics')
      .then((result) => {
        commit('setQuestionsSubtopics', result.data.questions);
      })
      .catch((error) => {
        console.log('Error en el fetchQuestionsBySubtopic', error.response);
      });
  },
  fetchHistory ({ commit }) {
    return this.$axios
      .$get('/student/custom-tests')
      .then((result) => {
        commit('setHistory', result.data.custom_tests);
      })
      .catch((error) => {
        console.log('Error en el fetchHistory', error.response);
      });
  },
  loadCustomTest ({ state, commit, dispatch }, customTest) {
    commit('setCustomTest', customTest);
    if (state.customTest.by_time) {
      if (dispatch('prepareTimeTest')) {
        commit('setFetchedTest', true);
      }
    } else {
      commit('setFetchedTest', true);
    }
  },
  fetchCustomTest ({ state, commit, dispatch }, customTestId) {
    return this.$axios
      .$get(`/student/custom-tests/${customTestId}`)
      .then((result) => {
        localStorage.setItem(
          `test_${customTestId}`,
          JSON.stringify(result.data.custom_test),
        );
        dispatch('loadCustomTest', result.data.custom_test);
      })
      .catch((error) => {
        alert('Error en el fetchCustomTest');
        console.log('Error en el fetchCustomTest', error);
      });
  },
  fetchCustomTestRetro ({ commit }, customTestId) {
    return this.$axios
      .$get(`/student/custom-tests/retro?custom_test_id=${customTestId}`)
      .then((result) => {
        commit('setCustomTest', result.data.custom_test);
        commit('setFetchedTest', true);
      })
      .catch((error) => {
        alert('Error en el fetchCustomTest');
        console.log('Error en el fetchCustomTest', error.response);
      });
  },
  prepareTimeTest ({ state, dispatch, commit }) {
    const time = state.customTest.total_time;
    const finish = moment(state.customTest.start_at);
    finish.add(time, 's');
    if (moment().isAfter(finish)) {
      dispatch('finishTest');
      return false;
    } else {
      const duration = moment.duration(finish.diff(moment()));
      const restTime = duration.asSeconds();
      dispatch('initTimer', duration);
      setTimeout(() => {
        if (!state.finishedTest) {
          dispatch('finishTest');
        }
      }, 1000 * restTime);
      return true;
    }
  },
  finishTest ({ state, dispatch, commit }) {
    return dispatch('sendAnswers').then(() => {
      commit('setFinishedTest', true);
      this.$router.push('/custom_test_config');
    });
  },
  prevCase ({ state, commit }) {
    if (state.caseIndex > 0) {
      commit('setCaseIndex', state.caseIndex - 1);
    }
  },
  nextCase ({ state, commit }) {
    if (state.caseIndex < state.customTest.cases.length - 1) {
      commit('setCaseIndex', state.caseIndex + 1);
    }
  },
  nextQuestion ({ state, commit, getters }) {
    if (
      getters.selectedQuestion.index <
      state.customTest.questions.length - 1
    ) {
      const nextIndex = getters.selectedQuestion.index + 1;
      const question = state.customTest.questions[nextIndex];
      commit('setSelectedQuestion', question);
    }
  },
  sendAnswers ({ state, commit }) {
    // Flush any debounced persist so we don't overwrite localStorage after removeItem
    commit('flushPersistToStorage');
    const _ans = state.customTest.questions.map((question) => {
      return {
        answer: question.response,
        time: question.time,
        first_answer: question.first_answer,
      };
    });
    const params = { custom_test_id: state.customTest.id, answers: _ans };
    commit('setSendingAnswers', true);
    return this.$axios
      .$post('/student/custom-tests/answers', params)
      .then((response) => {
        localStorage.removeItem(`test_${state.customTest.id}`);
        return response;
      })
      .catch((error) => {
        return error;
      })
      .finally(() => {
        commit('setSendingAnswers', false);
      });
  },
  initTimer ({ state, commit }, duration) {
    const timer = setInterval(() => {
      if (duration.asSeconds <= 0) {
        clearInterval(state.timer);
      } else {
        duration = moment.duration(duration.asSeconds() - 1, 'seconds');
        let hours = duration.hours().toString();
        let minutes = duration.minutes().toString();
        let seconds = duration.seconds().toString();
        if (hours.length < 2) {
          hours = '0' + hours;
        }
        if (minutes.length < 2) {
          minutes = '0' + minutes;
        }
        if (seconds.length < 2) {
          seconds = '0' + seconds;
        }
        const timerString = `${hours}:${minutes}:${seconds}`;
        commit('setTimerString', timerString);
      }
    }, 1000);
    commit('setTimer', timer);
  },
};
