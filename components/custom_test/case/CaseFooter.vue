<template>
  <div class="d-flex justify-content-between align-items-center">
    <span
      class="report-question"
      @click="$bvModal.show('report-question-modal')"
    >
      Reportar pregunta
    </span>
    <b-button
      :disabled="selectedQuestion.index >= customTest.questions.length - 1"
      variant="primary"
      @click="$store.dispatch('custom_test/nextQuestion')"
    >
      Siguiente
    </b-button>
    <ReportQuestionModal
      :caseId="caseSelected.id"
    />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import ReportQuestionModal from '@/components/_functional/reportQuestionModal.vue'

export default {
  components: {
    ReportQuestionModal
  },
  computed: {
    ...mapState({
      customTest: state => state.custom_test.customTest
    }),
    ...mapGetters({
      caseSelected: 'custom_test/caseSelected',
      caseIndex: 'custom_test/caseIndex',
      selectedQuestion: 'custom_test/selectedQuestion'
    })
  }
}
</script>
