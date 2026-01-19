<template>
  <div class="h-100">
    <CaseIndex v-if="caseId" />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import CaseIndex from '@/components/custom_test/case/CaseIndex.vue';
export default {
  name: 'CustomTest',
  components: {
    CaseIndex,
  },
  data () {
    return {
      custom_test_id: null,
      studyTimeTimelapseListener: undefined,
    };
  },
  computed: {
    ...mapState({
      fetchedTest: (state) => state.custom_test.fetchedTest,
      caseId: (state) => state.custom_test.caseId,
      custom_test: (state) => state.custom_test.customTest,
      testsTimelapse: (state) => state.studytime.testsTimelapse,
    }),
  },
  created () {
    // La carga del test se hace en la página padre (custom_test.vue)
    // Solo guardamos el id para referencia
    this.custom_test_id = this.$route.query.custom_test_id;
  },
  mounted () {
    this.addStudyTime();
  },
  methods: {
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
    },
  },
};
</script>
