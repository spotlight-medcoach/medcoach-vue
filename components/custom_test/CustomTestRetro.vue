<template>
  <div class="h-100">
    <CaseIndex v-if="caseId" retro />
    <QuestionsIndex v-else :retro="true" :custom_test="custom_test" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import QuestionsIndex from '@/components/custom_test/QuestionsIndex.vue';
import CaseIndex from '@/components/custom_test/case/CaseIndex.vue';

export default {
  name: 'CustomTestRetro',
  components: {
    QuestionsIndex,
    CaseIndex,
  },
  computed: {
    ...mapState({
      fetchedTest: (state) => state.custom_test.fetchedTest,
      caseId: (state) => state.custom_test.caseId,
      custom_test: (state) => state.custom_test.customTest,
    }),
  },
};
</script>
