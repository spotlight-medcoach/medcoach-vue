<template>
<div class="test">
    <div class="container">
        <button class="button" v-on:click="backward"> Volver</button>
    </div>
    <div class="container d-flex justify-content-between">
        <button class="button" v-on:click="back"> Anterior </button>
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
            <div class="answer_icons">
            <b-icon-check class="h3" variant="success" v-if="correct === index + 1"></b-icon-check>
            <b-icon-x class="h3" variant="danger" v-if="selected === index && correct != index + 1"></b-icon-x>
            </div>
               <b-form-radio type="radio" name="respuesta" :disabled=true v-model="selected" :value="index"></b-form-radio>
                <div v-html="item.html"></div>
            </div>
        </b-form-group>
        <div v-html="retroHTML">
    </div>
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
      correct: '',
      simulator_data: '',
      retroHTML: null
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
      this.current_question = parseInt(localStorage.getItem('current_feedback_question')) + 1
      this.simulator_data = JSON.parse(localStorage.getItem('simulator_feedback'))
      this.question = this.simulator_data.questions.find(question => question.id === this.$route.query.id)
      this.selected = this.question.answer - 1
      this.correct = this.question.correct_answer
      this.caseHTML = this.simulator_data.cases.find(cases => cases.id === this.question.case_id).html
      this.retroHTML = this.question.retro
    },
    next () {
      localStorage.setItem('current_feedback_question', parseInt(this.current_question))
      this.$router.push({ path: `/simulator_feedback_question/?id=${this.simulator_data.questions[this.current_question].id}` })
    },
    back () {
      if (this.current_question > 1) {
        localStorage.setItem('current_feedback_question', parseInt(this.current_question) - 2)
        this.$router.push({ path: `/simulator_feedback_question/?id=${this.simulator_data.questions[this.current_question - 2].id}` })
      }
    },
    backward () {
      this.$router.push({ path: `/simulator_feedback/?id=${this.simulator_data.id}` })
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
.answer_icons{
    margin-right:10px;
}
</style>
