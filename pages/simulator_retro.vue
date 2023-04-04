<template>
  <div id="simulator">
    <div class="content retro">
      <nuxt-link
        v-if="step === steps.Init"
        :to="`/simulator_results?id=${simulator_id}`"
        style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;position: absolute;left: 20px;top: 118px;"
      >
        <b-icon-chevron-left style="color:#FE9400; width:25px; height:25px;" />
        <b>Regresar a los resultados</b>
      </nuxt-link>
      <div v-if="step === steps.Init" id="init-retro" class="m-auto">
        <div>
          <p class="bg-title red-theme">
            RETROALIMENTACIÓN EXAMEN SIMULADOR
          </p>
          <div class="d-flex justify-content-around">
            <button
              class="btn-sec"
              @click="setSession(0)"
            >
              RESULTADOS
            </button>
            <!-- <button
              class="btn-sec"
              @click="setSession(1)"
            >
              SEGUNDA PARTE
            </button> -->
          </div>
        </div>
      </div>
      <questions-index
        v-if="step === steps.IndexQuestions"
        :test="selectedTest"
        :session="session"
        @onClickBack="step = steps.Init"
        @onClickQuestion="goToQuestion"
        @goBack="goBack"
      />
      <test
        v-if="step === steps.Test"
        :test="selectedTest"
        retro
        :question-index="questionIndex"
        @onClickBack="step = steps.IndexQuestions"
      />
    </div>
    <b-modal id="modal-1" hide-footer hide-header no-close-on-backdrop size="sm">
      <div class="popup">
        <p>Cargando resultados</p>
        <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters({
      testBlock1: 'simulators/testBlock1'
      // testBlock2: 'simulators/testBlock2'
    })
  },
  async mounted () {
    this.$bvModal.show('modal-1')
    await this.$store.dispatch('simulators/getRetro', this.simulator_id)
    this.tests = [this.testBlock1]
    this.$bvModal.hide('modal-1')
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
    },
    goBack () {
      this.step = this.steps.Init
    }
  }
}
</script>
