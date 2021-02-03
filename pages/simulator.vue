<template>
  <div id="simulator">
    <div class="content">
      <select-session
        v-if="steps.SelectSession === step"
        class="m-auto"
        @onSetSession="setSession"
      />
      <block-message
        v-else-if="steps.ShowBlock1 === step"
        class="m-auto"
        :title="block_1.title"
        :message="block_1.message"
        @onEnter="step = steps.ShowTest"
      />
      <test
        v-else-if="steps.ShowTest === step"
        class="m-auto"
      />
    </div>
  </div>
</template>
<script>
import SelectSession from '@/components/simulators/intro/SelectSession'
import BlockMessage from '@/components/simulators/intro/BlockMessage'
import Test from '@/components/simulators/intro/Test'

export default {
  components: {
    SelectSession,
    BlockMessage,
    Test
  },
  data () {
    const steps = {
      SelectSession: 1,
      ShowBlock1: 3,
      ShowTest: 4,
      ShowBrake: 5,
      ShowBlock2: 7,
      Finish: 8
    }
    return {
      steps,
      session: 0,
      test: null,
      simulator_id: this.$route.query.simulator_id,
      step: steps.SelectSession,
      block_1: {
        title: 'PRIMERA PARTE - EXAMEN NACIONAL PARA RESIDENCIAS MÉDICAS',
        message: 'PRIMERA PARTE QUE CONSTA DE 250 PREGUNTAS DE OPCIÓN MÚLTIPLE, PARA LAS CUALES TENDRÁS 5 HORAS. RECUERDA RELLENAR DE FORMA COMPLETA EN UNA SOLA RESPUESTA POR PREGUNTA. NO MALTRATES ESTA HOJA.'
      }
    }
  },
  methods: {
    setSession (value) {
      this.session = value
      localStorage.setItem('session', this.session)
      this.step = this.steps.ShowBlock1
    }
  },
  created () {
    console.clear()
    const session = localStorage.getItem('session')
    if (session) {
      this.session = session
      this.step = this.steps.ShowBlock1
    }
  }
}
</script>
