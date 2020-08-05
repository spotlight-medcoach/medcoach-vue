<template>
<div class="test">
<div class="container d-flex justify-content-between">
<button class="button"> Salir sin terminar la sección</button>
<button class="button">Salir y terminar la sección</button>
</div>
<div class="container d-flex justify-content-center">
<button class="button"> consulta de preguntas </button>
</div>
<div class="container d-flex justify-content-between">
<button class="button"> Anterior </button>
<button class="button"> Contestar y permanecer en la pregunta </button>
<button class="button" v-on:click="next"> Siguiente </button>
</div>
<div style="text-align:center; background-color:#858585; margin-top:30px">
<span><b>CASO CLÍNICO</b></span>
</div>
<div v-html="caseHTML">
</div>
<div style="background-color:#858585; margin:30px; width:200px">
<span><b> PREGUNTA {{current_question}} </b></span>
</div>
<div v-html="question.html"></div>
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
export default {
  data () {
    return {
      caseHTML: null,
      current_question: 0,
      question: null,
      selected: '',
      answers: [],
      simulator_data: ''
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
      this.question = this.simulator_data.questions.find(question => question.id === this.$route.query.id)
      this.caseHTML = this.simulator_data.cases.find(cases => cases.id === this.question.case_id).html
      this.answers = localStorage.getItem('answers').split(',')
    },
    next () {
      this.answers[this.current_question - 1] = this.selected + 1
      localStorage.setItem('answers', this.answers)
      localStorage.setItem('current_question', parseInt(this.current_question))
      this.$router.push({ path: `/test_simulator/?id=${this.simulator_data.questions[this.current_question].id}` })
    }
  }
}
</script>
<style>
.test{
    margin:30px;
}
.button{
    background-color:#DBD4D4;
}
.container{
    margin-top:15px;
}
</style>
