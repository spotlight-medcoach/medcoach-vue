<template>
  <div class="h-100">
    <CaseIndex v-if="caseId" />
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import CaseIndex from '@/components/custom_test/case/CaseIndex.vue';

const CONST_TIME = 30; // seconds per question

export default {
  name: 'CustomTest',
  components: {
    CaseIndex,
  },
  data () {
    return {
      custom_test_id: null,
      studyTimeTimelapseListener: undefined,
      countdownTimeout: null,
      questionFocusedAt: null,
      activeQuestionIndex: null,
      isPaused: false,
      syncInterval: null,
    };
  },
  computed: {
    ...mapState({
      fetchedTest: (state) => state.custom_test.fetchedTest,
      caseId: (state) => state.custom_test.caseId,
      custom_test: (state) => state.custom_test.customTest,
      testsTimelapse: (state) => state.studytime.testsTimelapse,
      finishedTest: (state) => state.custom_test.finishedTest,
    }),
    ...mapGetters({
      selectedQuestion: 'custom_test/selectedQuestion',
    }),
  },
  watch: {
    fetchedTest (val) {
      if (val && this.custom_test) {
        this.startCountdown();
      }
    },
    selectedQuestion (newVal) {
      if (newVal && !this.finishedTest) {
        this.onQuestionChange(newVal.index);
      }
    },
  },
  created () {
    // La carga del test se hace en la página padre (custom_test.vue)
    // Solo guardamos el id para referencia
    this.custom_test_id = this.$route.query.custom_test_id;
  },
  mounted () {
    this.addStudyTime();
    if (this.fetchedTest && this.custom_test) {
      this.startCountdown();
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.syncInterval = setInterval(() => {
      this.$store.dispatch('custom_test/syncQuestionTimes');
    }, 90000);
  },
  beforeDestroy () {
    this.finalize();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    clearInterval(this.syncInterval);
  },
  methods: {
    startCountdown () {
      if (this.countdownTimeout !== null) { return; }
      const totalSeconds = CONST_TIME * this.custom_test.questions.length;
      const duration = moment.duration(totalSeconds, 'seconds');
      this.$store.dispatch('custom_test/initTimer', duration);
      this.countdownTimeout = setTimeout(() => {
        if (!this.finishedTest) {
          this.$store.dispatch('custom_test/sendAnswers').finally(() => {
            this.$router.push({ path: '/custom_test_config' });
          });
        }
      }, totalSeconds * 1000);
    },
    addStudyTime () {
      this.studyTimeTimelapseListener = setInterval(
        function () {
          this.$store.dispatch('studytime/addStudyTime', 'tests');
        }.bind(this),
        this.testsTimelapse * 60000,
      );
    },
    onQuestionChange (newIndex) {
      this.flushQuestionTime();
      this.questionFocusedAt = Date.now();
      this.activeQuestionIndex = newIndex;
      this.isPaused = false;
      this.$router.replace({ query: { ...this.$route.query, q: newIndex } }).catch(() => {});
    },
    flushQuestionTime () {
      if (this.isPaused || this.questionFocusedAt === null || this.activeQuestionIndex === null) {
        return;
      }
      const elapsed = Math.floor((Date.now() - this.questionFocusedAt) / 1000);
      if (elapsed > 0) {
        this.$store.commit('custom_test/addQuestionTime', {
          index: this.activeQuestionIndex,
          elapsed,
        });
      }
      this.questionFocusedAt = null;
    },
    pauseTimer () {
      if (this.isPaused) { return; }
      this.flushQuestionTime();
      this.isPaused = true;
    },
    resumeTimer () {
      if (!this.isPaused) { return; }
      this.isPaused = false;
      this.questionFocusedAt = Date.now();
    },
    handleVisibilityChange () {
      if (document.visibilityState === 'hidden') {
        this.pauseTimer();
      } else {
        this.resumeTimer();
      }
    },
    handleWindowBlur () {
      this.pauseTimer();
    },
    handleWindowFocus () {
      this.resumeTimer();
    },
    handleBeforeUnload () {
      // Flush in-flight wall-clock time synchronously before the page closes.
      // flushQuestionTime() updates the Vuex store; flushPersistToStorage()
      // writes it to localStorage immediately, bypassing the 3s debounce.
      this.flushQuestionTime();
      this.$store.commit('custom_test/flushPersistToStorage');
    },
    finalize () {
      clearInterval(this.studyTimeTimelapseListener);
      if (this.countdownTimeout) {
        clearTimeout(this.countdownTimeout);
        this.countdownTimeout = null;
      }
      const storeTimer = this.$store.state.custom_test.timer;
      if (storeTimer) {
        clearInterval(storeTimer);
        this.$store.commit('custom_test/setTimer', null);
      }
      this.flushQuestionTime();
      this.$store.dispatch('custom_test/syncQuestionTimes');
    },
  },
};
</script>
