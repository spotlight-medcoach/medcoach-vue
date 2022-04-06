<template>
  <div id="simulator_feedback_question" class="container" @click="handleClick">
    <div class="mb-4">
      <button class="button" @click="backward">
        Volver
      </button>
    </div>
    <div class="d-flex justify-content-between">
      <button class="button" @click="back">
        Anterior
      </button>
      <button class="button" @click="next">
        Siguiente
      </button>
    </div>
    <div style="text-align:center; background-color:#858585; margin-top:30px" class="mb-4">
      <span><b>CASO CLÍNICO</b></span>
    </div>
    <div v-html="caseSelected.html" />
    <div v-for="(question, index) in questionsByCase" :key="`grupo-${index}`" class="grp-questions">
      <div style="background-color:#858585; margin:30px; width:200px" class="text-center">
        <span><b> PREGUNTA {{ question.index + 1 }} </b></span>
      </div>
      <div v-html="question.html" />
      <b-form-group v-for="(item, index2) in question.answers" :key="index2">
        <div class="d-flex">
          <b-form-radio
            :key="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            v-model="question.answer"
            type="radio"
            :name="`answer-radios-${caseSelected.id}-${index}`"
            :disabled="true"
            :value="item.id"
          />
          <div
            :class="{'correct': (question.correct_answer === item.id),
                     'incorrect': (question.correct_answer !== item.id) }"
            v-html="item.html"
          />
          <div class="answer_icons">
            <b-icon-check v-if="question.correct_answer === item.id" class="h3 correct" />
            <b-icon-x v-else class="h3 incorrect" />
          </div>
        </div>
      </b-form-group>
      <div v-html="question.retro" />
    </div>
    <modal-image />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import ModalImage from '@/components/ModalImage'

export default {
  components: {
    ModalImage
  },
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
    },
    handleClick (event) {
      if (event.target.localName === 'img') {
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
<style>
#simulator_feedback_question {
  padding: 0px 150px;
}
#simulator_feedback_question .button{
  background-color:#DBD4D4;
}
#simulator_feedback_question img {
  cursor: pointer;
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
