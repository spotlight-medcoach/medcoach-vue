<template>
  <section id="case-index" class="d-flex mx-0 justify-content-center">
    <div id="right-side-questions">
      <CaseTimer class="mb-16px" />
      <!-- Descripción del caso clínico -->
      <section id="case-content" class="custom-card">
        <div id="case-description">
          <p class="header-md mb-10px">CASO</p>
          <p v-html="caseSelected.content"></p>
        </div>
        <CaseQuestions class="mb-10px"/>
        <CaseFooter />
      </section>
    </div>
    <AsideQuestionsIndex/>
  </section>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import CaseTimer from '@/components/custom_test/case/CaseTimer.vue'
import CaseQuestions from '@/components/custom_test/case/CaseQuestions.vue'
import AsideQuestionsIndex from '@/components/custom_test/case/AsideQuestionsIndex.vue'
import CaseFooter from '@/components/custom_test/case/CaseFooter.vue'

export default {
  components: {
    CaseTimer,
    CaseQuestions,
    AsideQuestionsIndex,
    CaseFooter
  },
  computed: {
    ...mapState({
      customTest: state => state.custom_test.customTest
    }),
    ...mapGetters({
      caseSelected: 'custom_test/caseSelected',
      questionsByCase: 'custom_test/questionsByCase',
      caseIndex: 'custom_test/caseIndex'
    })
  }
}
</script>
<style lang="scss">
#case-index {
  padding-top: 15px;

  #case-content {
    padding: 24px 44px 12px 44px;

    #case-description {
      margin-bottom: 60px;
    }
  }

  #right-side-questions {
    min-width: 793px;
    width: 793px;
    margin-right: 15px;
  }

  .report-question {
    font-size: 14px;
    text-decoration: underline;
    color: #DB393F;
    cursor: pointer;
  }
}
</style>
