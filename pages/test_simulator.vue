<template>
<div class="test">
<div class="d-flex content justify-content-between">
<button class="button" v-on:click="goback"> Salir sin terminar la sección</button>
<button class="button" v-on:click="save_test">Salir y terminar la sección</button>
</div>
<div class="d-flex content justify-content-center">
<button class="button" v-on:click="goback"> consulta de preguntas </button>
</div>
<div class="d-flex content justify-content-between">
<button class="button" v-on:click="previous"> Anterior </button>
<button class="button" v-on:click="answer"> Contestar y permanecer en la pregunta </button>
<button class="button" v-on:click="next"> Siguiente </button>
</div>
<div class="d-flex content justify-content-end">
<h3>{{this.count}}</h3>
</div>
<div style="text-align:center; background-color:#858585;">
<span><b>CASO CLÍNICO</b></span>
</div>
<div v-html="caseHTML">
</div>
<div style="background-color:#858585; margin:30px; width:200px">
<span><b> PREGUNTA {{current_question}} </b></span>
</div>
<div class="d-flex" v-html="question.html"></div>
<b-form-group v-for="(item, index) in question.answers" v-bind:key ="index">
<div class="d-flex">
<b-form-radio type="radio" name="respuesta" v-model="selected" :value="index"></b-form-radio>
<div v-html="item.html"></div>
</div>
</b-form-group>
</div>
</div>
</template>
<script>
import moment from 'moment/moment'

export default {
  data () {
    return {
      caseHTML: null,
      current_question: 0,
      question: null,
      selected: '',
      answers: [],
      simulator_data: '',
      count: ''
    }
  },
  watch: {
    '$route.query.id' () {
      this.load()
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      this.current_question = parseInt(localStorage.getItem('current_question')) + 1
      this.simulator_data = JSON.parse(localStorage.getItem('simulator'))
      if (localStorage.getItem('start_break') != null && localStorage.getItem('start_block2') === null) {
        this.$router.push({ path: `/simulator_break/?id=${this.simulator_date.id}` })
      }
      this.question = this.simulator_data.questions.find(question => question.id === this.$route.query.id)
      this.caseHTML = this.simulator_data.cases.find(cases => cases.id === this.question.case_id).html
      this.answers = localStorage.getItem('answers').split(',')
      this.selected = this.answers[this.current_question - 1] - 1
      let StartBlock = 0
      if (localStorage.getItem('start_block2') === null) {
        StartBlock = this.simulator_data.start_first_block
      } else {
        StartBlock = parseInt(localStorage.getItem('start_block2'))
      }
      const date = moment(StartBlock)
      const today = moment()
      const milliseconds = today.diff(date, 'milliseconds')
      const time = 18000000 - milliseconds
      let duration = moment.duration(time, 'milliseconds')
      this.countdown = setInterval(() => {
        duration = moment.duration(duration - 1000, 'milliseconds')
        this.count = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
        if (duration.asMilliseconds() <= 0) {
          this.save_test()
        }
      }, 1000)
    },
    next () {
      this.answer()
      if (this.current_question < this.answers.length) {
        localStorage.setItem('current_question', parseInt(this.current_question))
        this.$router.push({ path: `/test_simulator/?id=${this.simulator_data.questions[this.current_question].id}` })
      }
    },
    answer () {
      this.answers[this.current_question - 1] = this.selected + 1
      localStorage.setItem('answers', this.answers)
    },
    previous () {
      this.answer()
      if (this.current_question > 1) {
        localStorage.setItem('current_question', parseInt(this.current_question) - 2)
        this.$router.push({ path: `/test_simulator/?id=${this.simulator_data.questions[this.current_question - 2].id}` })
      }
    },
    goback () {
      this.answer()
      localStorage.setItem('current_question', parseInt(this.current_question) - 2)
      if (localStorage.getItem('start_block2') === null) {
        this.$router.push({ path: `/simulator_block1/?id=${this.simulator_data.questions[this.current_question - 2].id}` })
      } else {
        this.$router.push({ path: `/simulator_block2/?id=${this.simulator_data.questions[this.current_question - 2].id}` })
      }
    },
    save_test () {
      this.$axios.put(`/student/simulators?simulator_id=${this.simulator_data.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('usertoken')}`
        },
        data: {
          answers: JSON.stringify(this.answers)
        }
      }).then((res) => {
        if (localStorage.getItem('start_block2') === null) {
          localStorage.setItem('start_break', moment.now())
          this.$router.push({ path: `/simulator_break/?id=${this.simulator_data.id}` })
        } else {
          this.$router.push({ path: '/simulators' })
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style>
.test{
  margin: 30px;
}
.button{
    background-color:#DBD4D4;
}
.content{
    margin-top:15px;
}
.centered{
}
</style>
