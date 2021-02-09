<template>
  <div id="test-simulator">
    <div class="questions-container">
      <div class="d-flex justify-content-between align-items-center w-100 pb-3 mb-3 border-bottom">
        <countdown-timer
          :startTime="startTime"
          :durationTime="duration"
          @onTimeOver="finishTest"
        />
        <button class="btn-sec">REGRESAR</button>
      </div>
      <test-questions :cases="cases" />
    </div>
    <div class="answers-container">
      <answers
        :currentQuestions="currentQuestions"
        :countPages="countPages"
        :currentPage="idx_page"
        @onChangePage="setPage"
        @onFinishTest="finishTest"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TestQuestions from '@/components/simulators/intro/TestQuestions'
import Answers from '@/components/simulators/intro/Answers'
import CountdownTimer from '@/components/simulators/intro/CountdownTimer'

export default {
  props: {
    startTime: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    }
  },
  components: {
    TestQuestions,
    Answers,
    CountdownTimer
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
    },
    finishTest (val) {
      alert(val)
      this.$emit('onFinishTest', val)
    }
  }
}
</script>
