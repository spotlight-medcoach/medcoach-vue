<template>
  <div id="test-simulator">
    <div class="questions-container">
      <div class="d-flex justify-content-between align-items-center w-100 pb-3 mb-3 border-bottom">
        <countdown-timer
          v-if="!retro"
          :startTime="startTime"
          :durationTime="duration"
          @onTimeOver="finishTest"
        />
        <p v-else>&nbsp;</p>
        <button class="btn-sec" @click="$emit('onClickBack', true)">REGRESAR</button>
      </div>
      <test-questions
        :cases="cases"
        :retro="retro"
        @onSetAnswer="setAnswer"
      />
    </div>
    <div class="answers-container">
      <answers
        :currentQuestions="currentQuestions"
        :countPages="countPages"
        :currentPage="idx_page"
        :retro="retro"
        @onChangePage="setPage"
        @onFinishTest="finishTest"
        @onSetAnswer="setAnswer"
      />
    </div>
  </div>
</template>
<script>
import TestQuestions from '@/components/simulators/intro/TestQuestions'
import Answers from '@/components/simulators/intro/Answers'
import CountdownTimer from '@/components/simulators/intro/CountdownTimer'

export default {
  props: {
    startTime: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 0
    },
    test: {
      type: Array,
      required: true
    },
    retro: {
      type: Boolean,
      default: false
    },
    questionIndex: {
      type: Number,
      default: -1
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
    }
  },
  methods: {
    setPage (val) {
      this.idx_page = val
    },
    finishTest (val) {
      this.$emit('onFinishTest', val)
    },
    setAnswer ({ question, answer }) {
      if (!this.retro) {
        this.$emit('onSetAnswer', { question, answer })
      }
    }
  },
  created () {
    if (this.retro) {
      let auxIndex = this.questionIndex
      if (auxIndex >= 250) {
        auxIndex -= 250
      }
      this.idx_page = parseInt(auxIndex / 20)
    }
  },
  mounted () {
    if (this.retro) {
      location.href = `#question-${this.questionIndex}`
    }
  }
}
</script>
