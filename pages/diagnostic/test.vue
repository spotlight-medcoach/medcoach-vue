<template>
<div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <div class="bg-light border-right" id="sidebar-wrapper">
      <div class="list-group list-group-flush">
        <b-form-group label="Preguntas">
          <b-form-radio
            v-for="(quest, index) in questions"
            v-model="question_index"
            name="side-bar-radios"
            :key="`side-radio-${index}`"
            :value="index">
              {{ index + 1 }}
          </b-form-radio>
        </b-form-group>
      </div>
    </div>
    <!-- /#sidebar-wrapper -->
    <!-- Page Content -->
    <div id="page-content-wrapper">
      <div class="container-fluid" id="question">
        <div v-if="question" class="col-12">
          <div class="mt-4">
            <span class="font-weight-bold">Pregunta {{ question_index + 1 }}.</span>
            <br>
            <span v-html="question.id.question.html"></span>
          </div>
          <div class="mt5">
            <b-form-group label="Opciones">
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
          <div class="float-right">
             <b-button variant="outline-success" v-if="question_index != 99" @click="question_index++">Siguiente</b-button>
             <b-button variant="outline-success" v-else @click="finishTest">Finalizar</b-button>
          </div>
        </div>
        <div v-else class="col-12">
          <h1>No hay preguntas</h1>
        </div>
      </div>
    </div>
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
  #sidebar-wrapper{
    min-width: 150px;
    height: calc(100vh - 5rem);
    overflow-y: scroll;
  }
  #question{
    height: calc(100vh - 5rem);
    overflow-y: scroll;
    width: auto;
  }
</style>
