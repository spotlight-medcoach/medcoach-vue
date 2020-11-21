<template>
<div id="simulator_feedback_question" class="container">
  <div class="mb-4">
    <button class="button" v-on:click="backward"> Volver</button>
  </div>
  <div class="d-flex justify-content-between">
    <button class="button" v-on:click="back"> Anterior </button>
    <button class="button" v-on:click="next"> Siguiente </button>
  </div>
  <div style="text-align:center; background-color:#858585; margin-top:30px" class="mb-4">
    <span><b>CASO CLÍNICO</b></span>
  </div>
  <div v-html="caseSelected.html">
  </div>
  <div class="grp-questions" v-for="(question, index) in questionsByCase" :key="`grupo-${index}`">
    <div style="background-color:#858585; margin:30px; width:200px" class="text-center">
      <span><b> PREGUNTA {{question.index + 1}} </b></span>
    </div>
    <div v-html="question.html"></div>
      <b-form-group v-for="(item, index2) in question.answers" v-bind:key="index2">
        <div class="d-flex">
          <b-form-radio
            type="radio"
            :name="`answer-radios-${caseSelected.id}-${index}`"
            :key="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            :disabled="true"
            v-model="question.answer"
            :value="item.id">
          </b-form-radio>
          <div
            :class="{'correct': (question.correct_answer === item.id),
                     'incorrect': (question.correct_answer !== item.id) }"
            v-html="item.html">
          </div>
          <div class="answer_icons">
            <b-icon-check class="h3 correct" v-if="question.correct_answer === item.id" />
            <b-icon-x class="h3 incorrect" v-else />
          </div>
        </div>
      </b-form-group>
      <div v-html="question.retro">
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      selected: '',
      correct: '',
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
  computed: {
    ...mapState({
      caseIndex: state => state.simulators.caseIndex
    }),
    ...mapGetters({
      caseSelected: 'simulators/caseSelected',
      questionsByCase: 'simulators/questionsByCase'
    })
  },
  methods: {
    load () {
      // this.current_question = parseInt(localStorage.getItem('current_feedback_question')) + 1
      this.simulator_data = JSON.parse(localStorage.getItem('simulator_feedback'))
      this.$store.commit('simulators/setCaseId', this.$route.query.id)
      // this.question = this.simulator_data.questions.find(question => question.id === this.$route.query.id)
      // this.selected = this.question.answer - 1
      // this.correct = this.question.correct_answer
      // this.caseHTML = this.simulator_data.cases.find(cases => cases.id === this.question.case_id).html
      // this.retroHTML = this.question.retro
    },
    next () {
      const questLenght = this.questionsByCase.length
      if (this.questionsByCase[questLenght - 1].index < this.simulator_data.questions.length - 1) {
        const caseId = this.simulator_data.cases[this.caseIndex + 1].id
        this.$router.push({ path: `/simulator_feedback_question/?id=${caseId}` })
      }
    },
    back () {
      if (this.questionsByCase[0].index >= 1) {
        const caseId = this.simulator_data.cases[this.caseIndex - 1].id
        this.$router.push({ path: `/simulator_feedback_question/?id=${caseId}` })
      }
    },
    backward () {
      this.$router.push({ path: `/simulator_feedback/?id=${this.simulator_data.id}` })
    }
  }
}
</script>
<style>
#simulator_feedback_question {
  padding: 0px 150px;
}
#simulator_feedback_question .button{
  background-color:#DBD4D4;
}
.answer_icons{
    margin-right:10px;
}
.incorrect {
  color: red;
}
.correct {
  color: green;
  font-weight: bold;
}
</style>
