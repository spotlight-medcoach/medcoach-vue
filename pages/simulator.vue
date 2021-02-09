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
        :startTime="startTime"
        :duration="durationMs"
        @onFinishTest="saveBlock"
      />
      <show-break
        v-else-if="steps.ShowBreak === step"
        :duration="breakDuration"
        :startTimeBreak="startTimeBreak"
        @onFinishBreak="goToSecondBlock"
      />
      <block-message
        v-else-if="steps.ShowBlock2 === step"
        class="m-auto"
        :title="block_2.title"
        :message="block_2.message"
        @onEnter="step = steps.ShowTest"
      />
    </div>
  </div>
</template>
<script>
import SelectSession from '@/components/simulators/intro/SelectSession'
import BlockMessage from '@/components/simulators/intro/BlockMessage'
import Test from '@/components/simulators/intro/Test'
import ShowBreak from '@/components/simulators/intro/ShowBreak'

export default {
  components: {
    SelectSession,
    BlockMessage,
    Test,
    ShowBreak
  },
  data () {
    const steps = {
      SelectSession: 1,
      ShowBlock1: 3,
      ShowTest: 4,
      ShowBreak: 5,
      ShowBlock2: 7,
      Finish: 8
    }
    return {
      block_1: {
        title: 'PRIMERA PARTE - EXAMEN NACIONAL PARA RESIDENCIAS MÉDICAS',
        message: 'PRIMERA PARTE QUE CONSTA DE 250 PREGUNTAS DE OPCIÓN MÚLTIPLE, PARA LAS CUALES TENDRÁS 5 HORAS. RECUERDA RELLENAR DE FORMA COMPLETA EN UNA SOLA RESPUESTA POR PREGUNTA. NO MALTRATES ESTA HOJA.',
        duration_ms: 18060000 // duración del primer bloque en milisegundos 5 hrs + 1 min
      },
      startTimeBreak: null,
      breakDuration: 3660000, // duración del break 1hr + 1 min
      block_2: {
        title: 'SEGUNDA PARTE - EXAMEN NACIONAL PARA RESIDENCIAS MÉDICAS',
        message: 'SEGUNDA PARTE QUE CONSTA DE 200 PREGUNTAS DE OPCIÓN MÚLTIPLE, PARA LAS CUALES TENDRÁS 5 HORAS. RECUERDA RELLENAR DE FORMA COMPLETA EN UNA SOLA RESPUESTA POR PREGUNTA. NO MALTRATES ESTA HOJA.',
        duration_ms: 14460000 // duración del break 4hr + 1 min
      },
      session: 0,
      simulator_id: this.$route.query.simulator_id,
      startTime: null,
      step: steps.SelectSession,
      steps,
      test: null
    }
  },
  computed: {
    durationMs () {
      if (this.session === '1') {
        return this.block_1.duration_ms
      } else if (this.session === '2') {
        return this.block_2.duration_ms
      }
      return null
    }
  },
  methods: {
    setSession (value) {
      this.session = value
      localStorage.setItem('session', this.session)
      this.step = this.steps.ShowBlock1
    },
    saveBlock (message) {
      this.goToBreak()
    },
    goToBreak () {
      this.startTime = '1612832400000'
      this.step = this.steps.ShowBreak
    },
    goToSecondBlock () {
      this.step = this.steps.ShowBlock2
      this.session = '2'
    }
  },
  created () {
    this.session = localStorage.getItem('session')
    this.startTimeBreak = localStorage.getItem('start_break')

    if (this.session) {
      this.step = this.steps.ShowBlock1

      if (this.session === '1') {
        this.startTime = localStorage.getItem('start_first_block')
      } else if (this.session === '2') {
        this.startTime = localStorage.getItem('start_second_block')
      }
    }
  }
}
</script>
