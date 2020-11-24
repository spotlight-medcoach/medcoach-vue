<template>
<div id="case-index">
  <!-- CABECERA -->
  <div id="cabecera">
    <div class="d-flex justify-content-between mt-5" v-if="!retro">
      <div class="boton px-2" @click="goToQuestions">SALIR SIN TERMINAR SECCIÓN</div>
      <div class="boton px-2" @click="finishTest">SALIR Y TERMINAR SECCIÓN</div>
    </div>
    <div class="d-flex justify-content-center my-3">
      <div class="boton px-6" v-html="`<< Consulta de preguntas >>`" @click="goToQuestions"></div>
    </div>
    <div class="d-flex justify-content-between mb-3">
      <div
        :class="{ 'disabled': caseIndex <= 0 }"
        class="boton px-4"
        v-html="`<<<< Anterior`"
        @click="$store.dispatch('custom_test/prevCase')"></div>
      <div class="boton px-5" v-if="!retro" @click="$toastr.success('Respuestas guardadas', 'Éxito')">Contestar y permanecer en la pregunta</div>
      <div
        :class="{ 'disabled': caseIndex >= customTest.cases.length - 1 }"
        class="boton px-4"
        v-html="'Siguiente >>>>'"
        @click="$store.dispatch('custom_test/nextCase')"></div>
    </div>
    <div v-if="customTest.by_time && !retro" class="text-center mb-1">
      {{timerString}}
    </div>
    <div id="linea">
      CASO CLÍNICO
    </div>
  </div>
  <!-- CUERPO -->
  <div id="cuerpo" @click="handleClick" :class="{'retro': retro}">
    <div id="case" v-html="caseSelected.content"></div>
    <div class="questions" v-for="(question, index) in questionsByCase" :key="`quest-${index}`">
      <div class="title-question"> Pregunta {{question.index + 1}} </div>
      <div v-html="question.content"></div>
      <b-form-group label="">
        <b-form-radio
          :disabled="retro"
          v-for="(ans, index2) in question.answers"
          :checked="question.response"
          @input="setAnswer(question.index, $event)"
          :name="`answer-radios-${caseSelected.id}-${index}`"
          :key="`answer-radio-${caseSelected.id}-${index}-${index2}`"
          :value="ans.id"
          :class="{'correct': (retro && question.correct_answer === ans.id),
                   'incorrect': (retro && ans.id !== question.correct_answer)}">
            <span v-html="ans.html"></span>
            <span class="h4 icono" v-if="retro">
              <b-icon class="correct" icon="check" v-if="ans.id === question.correct_answer"></b-icon>
              <b-icon class="incorrect" icon="x" v-else></b-icon>
            </span>
        </b-form-radio>
      </b-form-group>
      <!-- RETRO -->
      <div v-if="retro" class="mb-5">
        <div class="title-question">Retroalimentación</div>
        <div v-html="question.retro"></div>
        <hr class="mt-5">
      </div>
      <!-- FIN RETRO -->
    </div>
  </div>
  <!-- PIE -->
  <div id="pie" class="d-flex justify-content-between" style="padding-bottom: 5rem;">
    <div
        :class="{ 'disabled': caseIndex <= 0 }"
        class="boton px-4"
        v-html="`<<<< Anterior`"
        @click="$store.dispatch('custom_test/prevCase')"></div>
    <div class="boton px-5" @click="$toastr.success('Respuestas guardadas', 'Éxito')" v-if="!retro">Contestar y permanecer en la pregunta</div>
    <div
        :class="{ 'disabled': caseIndex >= customTest.cases.length - 1 }"
        class="boton px-4"
        v-html="'Siguiente >>>>'"
        @click="$store.dispatch('custom_test/nextCase')"></div>
  </div>
  <modal-image />
  <case-report :caseId="caseSelected.id" />
</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import ModalImage from '@/components/ModalImage'
import CaseReport from '@/components/simulators/CaseReport'

export default {
  name: 'case-index',
  props: {
    retro: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ModalImage,
    CaseReport
  },
  computed: {
    ...mapState({
      customTest: state => state.custom_test.customTest,
      timerString: state => state.custom_test.timerString
    }),
    ...mapGetters({
      caseSelected: 'custom_test/caseSelected',
      questionsByCase: 'custom_test/questionsByCase',
      caseIndex: 'custom_test/caseIndex'
    })
  },
  methods: {
    goToQuestions () {
      this.$store.commit('custom_test/setCaseId', null)
    },
    setAnswer (questionIndex, response) {
      this.$store.commit('custom_test/setQuestionResponse', { index: questionIndex, value: response })
    },
    finishTest () {
      this.$store.dispatch('custom_test/sendAnswers')
        .then((response) => {
          console.clear()
          console.log(response)
          this.$toastr.success('Se guardaron sus respuestas correctamente', 'Éxito')
        })
        .catch((error) => {
          console.clear()
          console.log(error.response)
          this.$toastr.error('Hubo un error al enviar sus respuestas', 'Error')
        })
        .finally(() => {
          this.$router.push({ path: '/custom_test_config' })
        })
    },
    handleClick (event) {
      if (event.target.localName === 'img' && this.retro) {
        const modal = document.getElementById('myModal')
        const modalImg = document.getElementById('img01')
        const captionText = document.getElementById('caption')
        modalImg.src = event.target.src
        captionText.innerHTML = event.target.alt
        modal.style.display = 'block'
        document.body.style.overflow = 'hidden'
        this.$store.commit('setShowStudentHeader', false)
      }
    }
  }
}
</script>
<style lang="scss">
  .retro img {
    cursor: pointer;
  }
  #case-index {
    .px-6{
      padding: 0px 5.23rem;
    }
    .boton {
      background-color: #c4c4c4;
      cursor: pointer;
    }
    .boton:hover {
      text-decoration: underline;
    }
    .disabled {
      cursor: default
    }
    .disabled:hover {
      text-decoration: none;
    }
    #linea {
      background: gray;
      font-weight: 600;
      text-align: center;
      margin-bottom: 1rem;
    }
    #pie {
      padding-top: 2rem;
    }
    #case {
      text-align: justify;
    }
    .title-question {
      font-weight: 600;
      font-size: 1.2rem;
    }
    .icono {
      top: -2px;
      right: -25px;
      position: absolute;
    }
    .incorrect {
      color: red;
    }
    .correct {
      color: green;
    }
    .correct .custom-control-label {
      color: inherit;
      font-weight: bold;
    }
    .incorrect .custom-control-label {
      color: inherit;
    }
  }
</style>
