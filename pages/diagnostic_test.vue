<template>
<div :style="{'background-color': $store.state.actualColorBg}" id="diagnostic_test">
  <b-navbar :style="{'background-color':`${$store.state.actualColorBg} !important`, 'color':`${$store.state.actualColorFont} !important`}" class="navbarBg pl-0" toggleable="lg" type="dark" variant="info">
    <b-navbar-nav style="width: 8.333333%;" class="mr-5">
      <div :style="`font-size:${$store.state.fontSize}em; color: ${$store.state.actualColorFont}`" class="center">
        <span class="darkorange">{{ question_index + 1 }} / {{ questions.length }} </span>
      </div>
    </b-navbar-nav>
    <b-navbar-nav>
      <!-- BACK -->
      <div class="mr-5 pointer text-center" @click="backQuestion" :class="{'disabled': question_index === 0}">
        <i class="fas fa-arrow-left fa-2x"></i>
        <div> Anterior </div>
      </div>

      <!-- NEXT -->
      <div class="ml-5 pointer text-center" @click="nextQuestion" :class="{'disabled': question_index === (questions.length - 1)}">
        <i class="fas fa-arrow-right fa-2x"></i>
        <div> Siguiente </div>
      </div>
    </b-navbar-nav>
    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
          <b-button @click="$store.commit('changeFontSize')" size="sm" class="btnLetterChange mr-2" type="submit">A</b-button>
          <b-button :style="{'background-color':$store.state.actualColorBtn}" @click="$store.dispatch('changeThemeColor')" size="sm" class="btnColorChange mr-2" type="submit"/>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <b-container id="container" :style="`font-size:${$store.state.fontSize}em; color: ${$store.state.actualColorFont}`" :class="[themeColor]">
    <b-row class="m-0" style="height: 100%;">
      <!-- SCROLL CON LAS PREGUNTAS -->
      <b-col cols="1" class="p-0 scroll" id="questions" ref="questions">
        <div class="quest-rd"></div>
        <!-- v-for -->
        <div
             class="d-flex justify-content-around pointer align-items-center quest-rd"
             v-for="(quest, index) in questions"
             :key="`side-radio-${index}`"
             :class="{ 'selected-quest': question_index === index }">
          <div
            class="radio"
            @click="question_index = index"
            :class="{ 'fill-circle': answers[index].response !== null }">
          </div>
          <div class="number" @click="question_index = index">
            {{ index + 1 }}
          </div>
          <div class="flag d-flex align-items-center" @click="toggleFlag(index)">
            <div v-show="quest.flag">
              <img src="@/assets/icons/orange_flag.svg" alt="" v-if="themeColor === 'light'">
              <img src="@/assets/icons/flag.svg" alt="" v-else-if="themeColor === 'sepia' || question_index === index">
              <img src="@/assets/icons/black_flag.svg" alt="" v-else>
            </div>
          </div>
        </div>
        <!-- /v-for --->
      </b-col>
      <!-- CONTENIDO DE LA PREGUNTA -->
      <b-col cols="11" class="scroll" id="question" ref="question">
        <div v-if="sending_questions">
          <loading-state message="Enviando preguntas, por favor espere" />
        </div>
        <div v-else-if="question">
          <div class="title-question mt-5">
            <span class="font-weight-bold">Pregunta {{ question_index + 1 }}</span>
          </div>
          <div class="mt-5 text-justify" v-html="question.id.question.html"></div>
          <div>
            <b-form-group label="">
              <b-form-radio
                v-for="(ans, index) in question.id.answers"
                v-model="selected_answer"
                name="answer-radios"
                :key="`answer-radio-${index}`"
                :value="ans.id">
                  <span v-html="ans.html"></span>
              </b-form-radio>
            </b-form-group>
          </div>
          <div class="my-5">
             <b-button class="rounded-pill" variant="success" v-if="question_index != 99" @click="nextQuestion">Guardar y Continuar</b-button>
             <b-button variant="success" v-else @click="finishTest">Finalizar</b-button>
          </div>
        </div>
        <div class="mt-5" style="font-size: 32px;" v-else-if="error_request">
          {{ message_error }}
        </div>
        <div v-else>
          <loading-state message="Cargando preguntas, por favor espere" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
export default {
  components: {
    LoadingState
  },
  data () {
    return {
      questions: [],
      answers: [],
      question_index: 0,
      selected_answer: null,
      error_request: false,
      message_error: 'No se pudieron obtener las preguntas',
      sending_questions: false
    }
  },
  computed: {
    question () {
      if (this.questions.length) {
        return this.questions[this.question_index]
      } else {
        return null
      }
    },
    ...mapState(['themes/themeColor'])
  },
  watch: {
    'selected_answer' (value) {
      if (!isNaN(value)) {
        const index = this.question_index
        this.answers[index].response = value

        if (value === this.question.id.correct_answer) {
          this.answers[index].correct = true
        } else {
          this.answers[index].correct = false
        }
        localStorage.setItem('diagnostic_test_answers', JSON.stringify(this.answers))
      }
    },
    'question_index' (value) {
      if (!isNaN(value)) {
        this.selected_answer = this.answers[value].response
        /* el 48 es el height del .quest-rd */
        this.$refs.question.scrollTop = 0
      }
    }
  },
  async created () {
    const token = localStorage.getItem('usertoken')

    if (!token) {
      alert('No tiene token')
      this.$router.push({ path: '/' })
    } else {
      this.token = token
      try {
        const response = await this.getQuestions()
        this.questions = response.data.questions.map((question) => {
          question.flag = false
          return question
        })
        let answers = JSON.parse(localStorage.getItem('diagnostic_test_answers'))
        if (answers === null) {
          answers = this.questions.map((question) => {
            return { response: null, correct: false }
          })
          localStorage.setItem('diagnostic_test_answers', JSON.stringify(answers))
        } else {
          this.selected_answer = answers[0].response
        }
        this.answers = answers
        console.log('respuesta', response)
      } catch (e) {
        this.error_request = true
        console.error(e)
      }
    }
  },
  methods: {
    toggleFlag (index) {
      this.questions[index].flag = !this.questions[index].flag
    },
    backQuestion () {
      if (this.question_index > 0) {
        this.question_index--
        this.$refs.questions.scrollTop = 48 * this.question_index
      }
    },
    nextQuestion () {
      if (this.question_index < (this.questions.length - 1)) {
        this.question_index++
        this.$refs.questions.scrollTop = 48 * this.question_index
      }
    },
    getQuestions () {
      return new Promise((resolve, reject) => {
        this.$axios
          .get('https://wup7ric684.execute-api.us-west-2.amazonaws.com/refinery/api/students/diagnostic',
            {
              headers: {
                Authorization: `Bearer ${this.token}`
              }
            }
          )
          .then(response => resolve(response))
          .catch(err => reject(err))
      })
    },
    finishTest () {
      const body = { answers: this.answers }
      this.sending_questions = true
      this.$axios
        .put('https://wup7ric684.execute-api.us-west-2.amazonaws.com/refinery/api/students/diagnostic',
          body,
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        )
        .then((response) => {
          localStorage.removeItem('diagnostic_test_answers')
          this.$store.dispatch('initialized')
          this.$router.push({ path: '/dashboard' })
        })
        .catch((error) => {
          console.error(error)
          alert('ocurrio un error al enviar las respuestas')
          this.error_request = true
          this.sending_questions = false
          this.message_error = 'Lo sentimos. No se pudieron enviar las respuestas'
        })
    }
  }
}
</script>
