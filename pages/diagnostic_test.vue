<template>
<div :style="{'background-color': $store.state.actualColorBg}">
  <b-navbar :style="{'background-color':`${$store.state.actualColorBg} !important`, 'color':`${$store.state.actualColorFont} !important`}" class="navbarBg" toggleable="lg" type="dark" variant="info">
    <b-navbar-nav>
      <div :style="`font-size:${$store.state.fontSize}em; color: ${$store.state.actualColorFont}`">
        2 / 10
      </div>
    </b-navbar-nav>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
          <b-button @click="$store.commit('changeFontSize')" size="sm" class="btnLetterChange mr-2" type="submit">A</b-button>
          <b-button :style="{'background-color':$store.state.actualColorBtn}" @click="$store.commit('changeColorBg')" size="sm" class="btnColorChange mr-2" type="submit"/>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <b-container id="container" :style="`font-size:${$store.state.fontSize}em; color: ${$store.state.actualColorFont}`">
    <b-row class="m-0" style="height: 100%;">
      <!-- SCROLL CON LAS PREGUNTAS -->
      <b-col cols="1" class="p-0 scroll" id="questions" :style="{'background-color': $store.state.test.sideBar}">
        <b-form-group label="">
          <b-form-radio
            v-for="(quest, index) in questions"
            v-model="question_index"
            name="side-bar-radios"
            :key="`side-radio-${index}`"
            :value="index">
              {{ index + 1 }}
          </b-form-radio>
        </b-form-group>
      </b-col>
      <!-- CONTENIDO DE LA PREGUNTA -->
      <b-col cols="11" class="p-0 scroll" id="question">
         <div v-if="question" class="pb-5 px-5">
          <div class="mt-4">
            <span class="font-weight-bold">Pregunta {{ question_index + 1 }}.</span>
            <br>
            <span v-html="question.id.question.html"></span>
          </div>
          <div class="mt5">
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
          <div>
             <b-button variant="success" v-if="question_index != 99" @click="question_index++">Guardar y Continuar</b-button>
             <b-button variant="success" v-else @click="finishTest">Finalizar</b-button>
          </div>
        </div>
        <div v-else class="col-12">
          <h1>No hay preguntas</h1>
        </div>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
export default {
  data () {
    return {
      questions: [],
      answers: [],
      token: '',
      question_index: 0,
      selected_answer: null
    }
  },
  computed: {
    question () {
      if (this.questions.length) {
        return this.questions[this.question_index]
      } else {
        return null
      }
    }
  },
  watch: {
    'selected_answer' (value) {
      if (!isNaN(value)) {
        const index = this.question_index
        this.answers[index].response = value

        if (value === this.question.response) {
          this.answers[index].correct = true
        } else {
          this.answers[index].correct = false
        }
      }
    },
    'question_index' (value) {
      if (!isNaN(value)) {
        this.selected_answer = this.answers[value].response
      }
    }
  },
  async created () {
    const token = localStorage.getItem('usertoken')

    if (token === undefined) {
      alert('No tiene token')
      this.$router.push('/')
    } else {
      this.token = token
      try {
        const response = await this.getQuestions()
        this.questions = response.data.questions

        this.answers = this.questions.map((question) => {
          return { response: null, correct: false }
        })

        console.log('respuesta', response)
      } catch (e) {
        alert('Error al obtener las preguntas')
        console.error(e)
      }
    }
  },
  methods: {
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
          alert('Respuestas enviadas correctamente')
        })
        .catch((error) => {
          console.error(error)
          alert('ocurrio un error al enviar las respuestas')
        })
    }
  }
}
</script>

<style>
  .navbarBg{
    border-bottom: 1px solid black;
  }
  .finishManualBtn{
      width:350px;
      height:35px;
      background-color: #20B000;
      border: none;
      border-radius: 10px;
  }
  .btnColorChange{
      height:50px;
      width: 50px;
      border-radius: 50%;
      border:3px solid #5F5F5F;
  }
  .btnLetterChange{
      height:50px;
      width: 50px;
      background-color: #5F5F5F;
      border-radius: 50%;
      font-size: 25px;
  }
  #container{
    max-width: 100vw;
    padding: 0px;
    height: calc(100vh - 50px - 1rem - 1px) !important; /* 50px => btnColor, 1rem=>padding nav, 1px => extra */
  }
  .scroll{
    overflow-y: scroll;
    height: 100%;
  }
  #questions .custom-radio .custom-control-label::before{
    border-color: darkorange;  /* orange */
    border-width: 2px;
    border-radius: 50%;
  }
  #questions label{
    color: darkorange;
    font-weight: bold;
  }
  #questions .custom-radio .custom-control-input:checked~.custom-control-label::after {
    border-color: darkorange;  /* orange */
    background: darkorange;
    border-width: 10px;
    border-radius: 50%;
  }

  #question .custom-radio .custom-control-input:checked~.custom-control-label::after {
    background-color: darkorange;  /* orange */
    border-width: 2px;
    border-radius: 50%;
  }
</style>
