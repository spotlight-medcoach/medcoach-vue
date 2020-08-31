<template>
<div class="container">
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
      <button class="button"> Contestar y permanecer en la pregunta </button>
      <button class="button" v-on:click="next"> Siguiente </button>
    </div>
    <div class="d-flex content justify-content-end">
      <h3>{{this.count}}</h3>
    </div>
    <div style="text-align:center; background-color:#858585;" class="mb-4">
      <span><b>CASO CLÍNICO</b></span>
    </div>
    <div v-html="caseSelected.html">
    </div>
    <div class="grp-questions" v-for="(question, index) in questionsByCase" :key="`grupo-${index}`">
      <div style="background-color:#858585; margin:30px; width:200px" class="text-center">
        <span><b> PREGUNTA {{question.index + 1 + initCount}} </b></span>
      </div>
      <div class="d-flex" v-html="question.html"></div>
      <b-form-group v-for="(item, index2) in question.answers" v-bind:key="`grupo-${index}-question-${index2}`">
        <div class="d-flex">
          <b-form-radio
            type="radio"
            :name="`answer-radios-${caseSelected.id}-${index}`"
            :key="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            :checked="question.answer"
            @input="setAnswer(question.index, $event)"
            :value="item.id"
            ></b-form-radio>
          <div v-html="item.html"></div>
        </div>
      </b-form-group>
    </div>
    <div class="d-flex content justify-content-between my-5">
      <button class="button" v-on:click="previous"> Anterior </button>
      <button class="button"> Contestar y permanecer en la pregunta </button>
      <button class="button" v-on:click="next"> Siguiente </button>
    </div>
    <b-modal id="modal-1" hide-footer hide-header  no-close-on-backdrop no-close-on-esc>
      <p class="title text-center" style="font-size:24px"><b>Finalizando bloque</b></p>
      <div class="text-center my-4">
       <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
      </div>
    </b-modal>
  </div>
</div>
</template>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment/moment'

export default {
  data () {
    return {
      // caseHTML: null,
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
  computed: {
    initCount () {
      let init = 0
      if (this.block === 2) {
        init = 250
      }
      return init
    },
    ...mapState({
      block: state => state.simulators.block,
      timeBlock1: state => state.simulators.timeBlock1,
      timeBlock2: state => state.simulators.timeBlock2,
      caseIndex: state => state.simulators.caseIndex
    }),
    ...mapGetters({
      caseSelected: 'simulators/caseSelected',
      questionsByCase: 'simulators/questionsByCase'
    })
  },
  methods: {
    setAnswer (questionIndex, response) {
      this.$store.commit('simulators/setQuestionResponse', { index: questionIndex, value: response })
      this.answers[questionIndex] = response
      localStorage.setItem('answers', this.answers)
    },
    load () {
      this.current_question = parseInt(localStorage.getItem('current_question')) + 1
      this.simulator_data = JSON.parse(localStorage.getItem('simulator'))
      if (localStorage.getItem('start_break') != null && localStorage.getItem('start_second_block') === null) {
        this.$router.push({ path: `/simulator_break/?id=${this.simulator_date.id}` })
      }
      this.$store.commit('simulators/setCaseId', this.$route.query.id)
      // this.caseHTML = this.simulator_data.cases.find(cases => cases.id === this.question.case_id).html
      this.answers = localStorage.getItem('answers').split(',')
      this.selected = this.answers[this.current_question - 1] - 1
      let StartBlock = 0
      if (localStorage.getItem('start_second_block') === 'null') {
        StartBlock = parseInt(localStorage.getItem('start_first_block'))
      } else {
        StartBlock = parseInt(localStorage.getItem('start_second_block'))
        this.$store.commit('simulators/setBlock', 2)
      }
      const date = moment(StartBlock)
      const today = moment()
      const milliseconds = today.diff(date, 'milliseconds')
      let limit = this.timeBlock1
      if (this.block === 2) {
        limit = this.timeBlock2
      }
      const time = limit - milliseconds
      let duration = moment.duration(time, 'milliseconds')
      this.countdown = setInterval(() => {
        duration = moment.duration(duration - 1000, 'milliseconds')
        this.count = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
        if (duration.asMilliseconds() <= 0) {
          clearInterval(this.countdown)
          this.save_test()
        }
      }, 1000)
    },
    next () {
      if (this.caseIndex < this.simulator_data.cases.length - 1) {
        const caseId = this.simulator_data.cases[this.caseIndex + 1].id
        this.$router.push({ path: `/test_simulator/?id=${caseId}` })
      }
    },
    previous () {
      if (this.caseIndex > 1) {
        const caseId = this.simulator_data.cases[this.caseIndex - 1].id
        this.$router.push({ path: `/test_simulator/?id=${caseId}` })
      }
    },
    goback () {
      localStorage.setItem('current_question', parseInt(this.current_question) - 1)
      if (localStorage.getItem('start_second_block') === 'null') {
        this.$router.push({ path: `/simulator_block1/?id=${this.simulator_data.questions[this.current_question - 1].id}` })
      } else {
        this.$router.push({ path: `/simulator_block2/?id=${this.simulator_data.questions[this.current_question - 1].id}` })
      }
    },
    save_test () {
      this.$bvModal.show('modal-1')
      const answer = this.answers.map(function (x) {
        return parseInt(x, 10)
      })
      this.$axios.put(`/student/simulators?simulator_id=${this.simulator_data.id}`, { answers: answer }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('usertoken')}`
        }
      }).then((res) => {
        if (localStorage.getItem('start_second_block') === 'null') {
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
  margin: 30px 150px;
}
.test .button {
  border: none;
}
.test .button:hover {
  text-decoration: underline;
}
.button{
  background-color:#DBD4D4;
}
.content{
  margin-top:15px;
  margin-left: 0px;
}
.test .button {
  margin-right: 0px;
  margin-left: 0px;
}
</style>
