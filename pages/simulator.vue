<template>
  <div id="simulator">
    <b-modal
      id="modal-finishblock"
      hide-footer
      hide-header
      no-close-on-backdrop
      no-close-on-esc
    >
      <div class="text-center">
        <p class="title" style="font-size:24px">
          <b>Finalizando bloque</b>
        </p>
        <div>
          <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
        </div>
      </div>
    </b-modal>
    <b-modal
      id="modal-start-second-block"
      hide-footer
      hide-header
      no-close-on-backdrop
      no-close-on-esc
    >
      <div class="text-center">
        <p class="title" style="font-size:24px">
          <b>Comenzando el segundo bloque</b>
        </p>
        <div>
          <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-load-simulator" hide-footer hide-header no-close-on-backdrop no-close-on-esc>
        <p class="title-modal" style="font-size:24px">
          <b>Cargando simulador, espere</b>
        </p>
        <div style="text-align: center;">
          <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
        </div>
      </b-modal>
    <div class="content">
      <select-session
        v-if="steps.SelectSession === step"
        class="m-auto"
        :session="session"
        :show-finish-button="showFinishButton"
        @onClick="onClickSelectSession"
        @onFinishTest="saveBlock"
      />
      <block-message
        v-else-if="steps.ShowBlock1 === step"
        class="m-auto"
        :title="block_1.title"
        :message="block_1.message"
        @onEnter="step = steps.ShowTest"
      />
      <test
        v-else-if="steps.ShowTest === step && getPages.length > 0"
        class="m-auto"
        :start-time="startTime"
        :duration="durationMs"
        :test="test"
        @onSetAnswer="setAnswer"
        @onClickBack="goToSession"
        @onFinishTest="saveBlock"
      />
      <show-break
        v-else-if="steps.ShowBreak === step"
        :duration="breakDuration"
        :start-time-break="startTimeBreak"
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
import moment from 'moment'
import { mapGetters } from 'vuex'
import SelectSession from '@/components/simulators/intro/SelectSession'
import BlockMessage from '@/components/simulators/intro/BlockMessage'
import Test from '@/components/simulators/intro/Test'
import ShowBreak from '@/components/simulators/intro/ShowBreak'
import { getSimulator, prepareSimulator, prepareTest } from '@/assets/js/helper'

export default {
  layout: 'new_default',
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
        title: 'EXAMEN NACIONAL PARA RESIDENCIAS MÉDICAS',
        message: 'BLOQUE QUE CONSTA DE 280 PREGUNTAS DE OPCIÓN MÚLTIPLE, PARA LAS CUALES TENDRÁS 5 HORAS.<br> RECUERDA RELLENAR DE FORMA COMPLETA EN UNA SOLA RESPUESTA POR PREGUNTA. NO MALTRATES ESTA HOJA.',
        duration_ms: 18060000 // duración del primer bloque en milisegundos 5 hrs + 1 min
      },
      startTimeBreak: null,
      breakDuration: 3660000, // duración del break 1hr + 1 min
      block_2: {
        title: 'SEGUNDA PARTE - EXAMEN NACIONAL PARA RESIDENCIAS MÉDICAS',
        message: 'SEGUNDA PARTE QUE CONSTA DE 200 PREGUNTAS DE OPCIÓN MÚLTIPLE, PARA LAS CUALES TENDRÁS 4 HORAS.<br> RECUERDA RELLENAR DE FORMA COMPLETA EN UNA SOLA RESPUESTA POR PREGUNTA. NO MALTRATES ESTA HOJA.',
        duration_ms: 14460000 // duración del break 4hr + 1 min
      },
      session: '0',
      simulator_id: this.$route.query.simulator_id,
      startTime: null,
      step: steps.SelectSession,
      steps,
      test: null,
      showFinishButton: false
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
    },
    ...mapGetters({
      getPages: 'simulators/pages'
    })
  },
  created () {
    this.session = localStorage.getItem('session')
    this.startTimeBreak = localStorage.getItem('start_break')

    if (this.session) {
      if (this.session === '1') {
        this.startTime = localStorage.getItem('start_first_block')
      } else if (this.session === '2') {
        this.startTime = localStorage.getItem('start_second_block')
      } else if (this.session === '3') {
        this.startTimeBreak = localStorage.getItem('start_break')
        this.step = this.steps.ShowBreak
      }
    }

    // const simu = JSON.parse(localStorage.getItem('simulator'))
    // this.test = prepareTest(simu)
  },
  async mounted () {
    if (this.getPages.length === 0) {
      this.showLoading()
      const res = await getSimulator(this.$axios, this.simulator_id)
      const simulator = prepareSimulator(res, this.simulator_id)
      this.$store.commit('simulators/setSimulator', simulator)
      const pages = prepareTest(simulator)
      this.$store.commit('simulators/setPages', pages)
      this.test = pages
      if (localStorage.getItem('answers') !== null) {
        const answers = JSON.parse(localStorage.getItem('answers'))
        this.$store.commit('simulators/setAnswers', answers)
      } else {
        console.log('Not answers')
        const answers = new Array(simulator.questions.length).fill(0)
        this.$store.commit('simulators/setAnswers', answers)
      }
      this.hideLoading()
    } else {
      this.test = this.getPages
    }
  },
  methods: {
    clearLocalStorage () {
      localStorage.removeItem('session')
      localStorage.removeItem('simulator')
      localStorage.removeItem('test')
      localStorage.removeItem('start_first_block')
      localStorage.removeItem('start_second_block')
      localStorage.removeItem('start_break')
    },
    showLoading () {
      this.$bvModal.show('modal-load-simulator')
    },
    hideLoading () {
      this.$bvModal.hide('modal-load-simulator')
    },
    onClickSelectSession (value) {
      if (value === '1') {
        this.step = this.steps.ShowBlock1
      } else {
        this.step = this.steps.ShowBlock2
      }
    },
    setSession (value) {
      this.session = value
      localStorage.setItem('session', this.session)
    },
    async saveBlock (message) {
      this.$bvModal.show('modal-finishblock')
      try {
        const answers = []
        this.test.forEach((page) => {
          page.forEach((_case) => {
            _case.questions.forEach((question) => {
              answers.push(parseInt(question.answer))
            })
          })
        })
        console.log(answers)
        await this.$axios.put(`/student/simulators?simulator_id=${this.simulator_id}`, { answers })
        // if (this.session === '1') {
        //   this.goToBreak(res.start_break)
        // } else if (this.session === '2') {
          this.clearLocalStorage()
          this.$router.push('/simulators')
        // }
        this.showFinishButton = false
      } catch (error) {
        console.error(error)
      }
      this.$bvModal.hide('modal-finishblock')
    },
    goToBreak (startBreak) {
      this.startTimeBreak = moment(startBreak).valueOf().toString()
      this.setSession('3')
      localStorage.setItem('start_break', this.startTimeBreak)
      this.step = this.steps.ShowBreak
    },
    async goToSecondBlock () {
      try {
        this.$bvModal.show('modal-start-second-block')
        this.setSession('2')

        const resBreak = await this.$axios.put(`/student/simulators/break?simulator_id=${this.simulator_id}`)
        const startSecondBlock = resBreak.data.start_second_block
        this.startTime = moment(startSecondBlock).valueOf().toString()

        const resSim = await this.$axios.get(`/student/simulators/get?simulator_id=${this.simulator_id}`)
        const simulator = prepareSimulator(resSim, this.simulator_id)
        this.test = prepareTest(simulator)
        this.$bvModal.hide('modal-start-second-block')
        this.step = this.steps.SelectSession
      } catch (error) {
        console.error(error)
      }
    },
    goToSession () {
      this.step = this.steps.SelectSession
      this.showFinishButton = true
    },
    setAnswer ({ question, answer, currentPage }) {
      this.$store.commit('simulators/setAnswer', { page_index: currentPage, question_index: question.index, answer: answer.id })
    }
  }
}
</script>
<style lang="scss">
  .title-modal{
    margin-bottom: 45px;
    text-align:center;
  }
</style>
