<template>
  <div id="test-simulator" class="container">
    <div class="test">
      <div class="d-flex content justify-content-between">
        <button class="button" @click="goback">
          Salir sin terminar la sección
        </button>
        <button class="button" @click="save_test">
          Salir y terminar la sección
        </button>
      </div>
      <div class="d-flex content justify-content-center">
        <button class="button" @click="goback">
          consulta de preguntas
        </button>
      </div>
      <div class="d-flex content justify-content-between">
        <button class="button" @click="previous">
          Anterior
        </button>
        <button class="button">
          Contestar y permanecer en la pregunta
        </button>
        <button
          class="button"
          :class="{'disabled': questionsByCase[questionsByCase.length - 1].index >= simulator_data.questions.length - 1}"
          @click="next"
        >
          Siguiente
        </button>
      </div>
      <div class="d-flex content justify-content-end">
        <h3>{{ count }}</h3>
      </div>
      <div style="text-align:center; background-color:#858585;" class="mb-4">
        <span><b>CASO CLÍNICO</b></span>
      </div>
      <div v-html="caseSelected.html" />
      <div v-for="(question, index) in preguntas" :key="`grupo-${index}`" class="grp-questions">
        <div style="background-color:#858585; margin:30px; width:200px" class="text-center">
          <span><b> PREGUNTA {{ question.index + 1 + initCount }} </b></span>
        </div>
        <div class="d-flex" v-html="question.html" />
        <!-- <b-form-group v-for="(item, index2) in question.answers" v-bind:key="`grupo-${index}-question-${index2}`">
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
      </b-form-group> -->
        <div>
          <div
            v-for="(ans, index2) in question.answers"
            :key="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            class="radios position-relative"
          >
            <input
              :id="`answer-radio-${caseSelected.id}-${index}-${index2}`"
              v-model="question.answer"
              type="radio"
              :name="`answer-radio-${caseSelected.id}-${index}-${index2}`"
              :value="ans.id"
              @change="setAnswer(question.index, question.answer)"
            >
            <label
              :for="`answer-radio-${caseSelected.id}-${index}-${index2}`"
              v-html="ans.html"
            />
          </div>
        </div>
      </div>
      <div class="d-flex content justify-content-between my-5">
        <button class="button" @click="previous">
          Anterior
        </button>
        <button class="button">
          Contestar y permanecer en la pregunta
        </button>
        <button
          class="button"
          :class="{'disabled': questionsByCase[questionsByCase.length - 1].index >= simulator_data.questions.length - 1}"
          @click="next"
        >
          Siguiente
        </button>
      </div>
      <b-modal id="modal-1" hide-footer hide-header no-close-on-backdrop no-close-on-esc>
        <p class="title text-center" style="font-size:24px">
          <b>Finalizando bloque</b>
        </p>
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
      count: '',
      preguntas: []
    }
  },
  watch: {
    '$route.query.id' () {
      this.load()
    },
    questionsByCase (newVal) {
      if (newVal) {
        this.preguntas = JSON.parse(JSON.stringify(this.questionsByCase))
      }
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
      console.log(2)
      this.$store.commit('simulators/setQuestionResponse', { index: questionIndex, value: response })
      this.answers[questionIndex] = response
      localStorage.setItem('answers', this.answers)
    },
    async load () {
      window.scrollTo(0, 0)
      this.current_question = parseInt(localStorage.getItem('current_question')) + 1
      this.simulator_data = this.$store.state.simulator
      if (localStorage.getItem('start_break') != null && localStorage.getItem('start_second_block') === null) {
        this.$router.push({ path: `/simulator_break/?id=${this.simulator_date.id}` })
      }
      await this.$store.commit('simulators/setCaseId', this.$route.query.id)
      this.preguntas = JSON.parse(JSON.stringify(this.questionsByCase))
      // this.caseHTML = this.simulator_data.cases.find(cases => cases.id === this.question.case_id).html
      this.answers = localStorage.getItem('answers').split(',')
      this.selected = this.answers[this.current_question - 1] - 1
      let StartBlock = 0
      if (localStorage.getItem('start_second_block') === 'null') {
        StartBlock = parseInt(localStorage.getItem('start_first_block'))
      } else {
        StartBlock = parseInt(localStorage.getItem('start_second_block'))
        await this.$store.commit('simulators/setBlock', 2)
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
      const questLenght = this.questionsByCase.length
      if (this.questionsByCase[questLenght - 1].index < this.simulator_data.questions.length - 1) {
        const caseId = this.simulator_data.cases[this.caseIndex + 1].id
        this.$router.push({ path: `/test_simulator/?id=${caseId}` })
      }
    },
    previous () {
      if (this.questionsByCase[0].index >= 1) {
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
<style lang="less">
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
#test-simulator {
  .disabled {
    cursor: default;
    opacity: 0.3;
  }
  .disabled:hover {
    text-decoration: none;
  }
}
</style>
