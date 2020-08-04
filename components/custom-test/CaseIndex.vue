<template>
<div id="case-index">
  <div id="cabecera">
    <div class="d-flex justify-content-between mt-5">
      <div class="boton px-2" @click="goToQuestions">SALIR SIN TERMINAR SECCIÓN</div>
      <div class="boton px-2" @click="finishTest">SALIR Y TERMINAR SECCIÓN</div>
    </div>
    <div class="d-flex justify-content-center my-3">
      <div class="boton px-6" v-html="`<< Consulta de preguntas >>`" @click="goToQuestions"></div>
    </div>
    <div class="d-flex justify-content-between">
      <div
        :class="{ 'disabled': caseIndex <= 0 }"
        class="boton px-4"
        v-html="`<<<< Anterior`"
        @click="$store.dispatch('custom_test/prevCase')"></div>
      <div class="boton px-5" @click="$toastr.success('Respuestas guardadas', 'Éxito')">Contestar y permanecer en la pregunta</div>
      <div
        :class="{ 'disabled': caseIndex >= customTest.cases.length - 1 }"
        class="boton px-4"
        v-html="'Siguiente >>>>'"
        @click="$store.dispatch('custom_test/nextCase')"></div>
    </div>
    <div id="linea">
      CASO CLÍNICO
    </div>
  </div>
  <div id="cuerpo">
    <div id="case" v-html="caseSelected.content"></div>
    <div class="questions" v-for="(question, index) in questionsByCase" :key="`quest-${index}`">
      <div class="title-question"> Pregunta {{index + 1}} </div>
      <div v-html="question.content"></div>
      <b-form-group label="">
        <b-form-radio
          v-for="(ans, index2) in question.answers"
          :checked="question.response"
          @input="setAnswer(question.index, $event)"
          :name="`answer-radios-${caseSelected.id}-${index}`"
          :key="`answer-radio-${caseSelected.id}-${index}-${index2}`"
          :value="ans.id">
            <span v-html="ans.html"></span>
        </b-form-radio>
      </b-form-group>
    </div>
  </div>
  <div id="pie" class="d-flex justify-content-between mb-5">
    <div
        :class="{ 'disabled': caseIndex <= 0 }"
        class="boton px-4"
        v-html="`<<<< Anterior`"
        @click="$store.dispatch('custom_test/prevCase')"></div>
    <div class="boton px-5" @click="$toastr.success('Respuestas guardadas', 'Éxito')">Contestar y permanecer en la pregunta</div>
    <div
        :class="{ 'disabled': caseIndex >= customTest.cases.length - 1 }"
        class="boton px-4"
        v-html="'Siguiente >>>>'"
        @click="$store.dispatch('custom_test/nextCase')"></div>
  </div>
</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'case-index',
  computed: {
    ...mapState({
      customTest: state => state.custom_test.customTest
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
    }
  }
}
</script>
<style lang="scss">
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
      margin: 2rem 0px;
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
  }
</style>
