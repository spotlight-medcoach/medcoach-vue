<template>
  <div id="test-simulator">
    <div class="questions-container">
      <button class="btn-sec">REGRESAR</button>
      <test-questions :cases="cases" />
    </div>
    <div class="answers-container">
      <answers
        :currentQuestions="currentQuestions"
        :countPages="countPages"
        :currentPage="idx_page"
        @onChangePage="setPage"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TestQuestions from '@/components/simulators/intro/TestQuestions'
import Answers from '@/components/simulators/intro/Answers'

export default {
  components: {
    TestQuestions,
    Answers
  },
  data () {
    return {
      idx_page: 0
    }
  },
  computed: {
    cases () {
      return this.test[this.idx_page]
    },
    countPages () {
      return this.test.length
    },
    currentQuestions () {
      const questions = []
      this.cases.forEach((_case) => {
        const _qs = _case.questions.map(quest => quest)
        questions.push(..._qs)
      })
      return questions
    },
    ...mapGetters({
      test: 'simulators/test'
    })
  },
  methods: {
    setPage (val) {
      this.idx_page = val
    }
  }
}
</script>
