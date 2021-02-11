<template>
  <div id="simulator">
    <div class="content retro">
      <nuxt-link
        v-if="step === steps.Init"
        :to="`/simulator_results?id=${simulator_id}`"
        class="mt-4 ml-4"
        style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;">
        <b-icon-chevron-left style="color:#FE9400; width:25px; height:25px;"></b-icon-chevron-left>
        <b>Regresar a los resultados</b>
      </nuxt-link>
      <div v-if="step === steps.Init" id="init-retro" class="m-auto">
        <div>
          <p class="bg-title red-theme">RETROALIMENTACIÓN EXAMEN SIMULADOR</p>
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
      questionIndex: -1,
      simulator_id: this.$route.query.id
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
