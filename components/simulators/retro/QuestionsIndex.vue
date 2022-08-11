<template>
  <div id="questions-index" class="container">
    <span
        @click="goBack"
        style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;position: absolute;left: 20px;top: 118px;cursor: pointer;"
      >
        <b-icon-chevron-left style="color:#FE9400; width:25px; height:25px;" />
        <b>Regresar a los resultados</b>
    </span>
    <p class="bg-title red-theme" v-if="session === 0">EXAMEN NACIONAL PARA RESIDENCIAS MÉDICAS</p>
    <p class="bg-title red-theme" v-else>SEGUNDA PARTE - EXAMEN NACIONAL PARA RESIDENCIAS MÉDICAS</p>
    <div class="container-questions">
      <div
        v-for="col in cols"
        class="col"
        :key="`col-${col}`"
      >
        <div
          v-for="row in rows"
          class="row card-answers"
          :key="`col-${col}-row-${row}`"
        >
          <question-element
            v-for="qbr in questionsByRow[row - 1]"
            :key="`col-${col}-row-${row}-q-${qbr}`"
            :indexQ="qbr"
            :question="getQuestion(col - 1, row - 1, qbr - 1)"
            @onClickQuestion="goToQuestion"
          />
        </div>
      </div>
    </div>
    <button class="btn-sec" @click="$emit('onClickBack')">REGRESAR</button>
  </div>
</template>
<script>
import QuestionElement from '@/components/simulators/retro/QuestionElement'
export default {
  components: {
    QuestionElement
  },
  props: {
    session: {
      type: Number,
      required: true
    },
    test: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      cols: 5
    }
  },
  computed: {
    rows () {
      if (this.session === 0) {
        return 3
      }
      return 2
    },
    questionsByRow () {
      const array = [20, 20]
      if (this.session === 0) {
        array.push(16)
      }
      return array
    },
    questionsByCol () {
      return this.questionsByRow.reduce((acc, acu) => acc + acu)
    },
    questions () {
      const questions = []
      this.test.forEach((page) => {
        page.forEach((_case) => {
          _case.questions.forEach((question) => {
            questions.push(question)
          })
        })
      })
      return questions
    }
  },
  methods: {
    getQuestion (col, row, qbr) {
      const prevRow = this.questionsByRow.slice(0, row)
      let prevQuest = 0
      if (prevRow.length) {
        prevQuest = prevRow.reduce((acc, acu) => acc + acu)
      }
      const index = (this.questionsByCol * col) + prevQuest + qbr
      return this.questions[index]
    },
    goToQuestion (index) {
      this.$emit('onClickQuestion', index)
    },
    goBack () {
      this.$emit('goBack')
    }
  }
}
</script>
