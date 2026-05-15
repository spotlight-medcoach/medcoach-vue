<template>
  <div class="h-100">
    <CaseIndex v-if="caseId" />
  </div>
</template>
<script>
import moment from 'moment';
import { mapState } from 'vuex';
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
  },
  watch: {
    fetchedTest (val) {
      if (val && this.custom_test) {
        this.startCountdown();
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
  },
  beforeDestroy () {
    this.finalize();
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
    },
  },
};
</script>
