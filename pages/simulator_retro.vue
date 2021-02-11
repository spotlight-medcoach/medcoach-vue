<template>
  <div id="simulator">
    <div class="content retro">
      <div v-if="step === steps.Init" id="init-retro" class="m-auto">
        <p class="title red-theme">RETROALIMENTACIÓN EXAMEN SIMULADOR</p>
        <div class="d-flex justify-content-around">
          <button
            class="btn-sec"
            @click="setSession(0)"
          >
            PRIMERA PARTE
          </button>
          <button
            class="btn-sec"
            @click="setSession(1)"
          >
            SEGUNDA PARTE
          </button>
        </div>
      </div>
      <questions-index
        v-if="step === steps.IndexQuestions"
        :test="selectedTest"
        :session="session"
        @onClickBack="step = steps.Init"
        @onClickQuestion="goToQuestion"
      />
      <test
        v-if="step === steps.Test"
        :test="selectedTest"
        retro
        :questionIndex="questionIndex"
        @onClickBack="step = steps.IndexQuestions"
      />
    </div>
  </div>
</template>
<script>
import QuestionsIndex from '@/components/simulators/retro/QuestionsIndex'
import Test from '@/components/simulators/intro/Test'
export default {
  components: {
    QuestionsIndex,
    Test
  },
  data () {
    const steps = {
      Init: 1,
      IndexQuestions: 2,
      Test: 3
    }
    return {
      steps,
      step: steps.Init,
      session: -1,
      tests: [],
      selectedTest: null,
      questionIndex: -1
    }
  },
  methods: {
    setSession (val) {
      this.session = val
      this.selectedTest = this.tests[this.session]
      this.step = this.steps.IndexQuestions
      localStorage.setItem('session', this.session + 1)
    },
    goToQuestion (index) {
      this.step = this.steps.Test
      this.questionIndex = index
    }
  },
  created () {
    const testBlock1 = JSON.parse(localStorage.getItem('test_block_1'))
    const testBlock2 = JSON.parse(localStorage.getItem('test_block_2'))
    this.tests = [testBlock1, testBlock2]
  }
}
</script>
