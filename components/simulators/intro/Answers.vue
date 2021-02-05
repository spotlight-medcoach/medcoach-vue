<template>
  <div class="sheet">
    <div class="sheet-answers">
      <p class="title-session red-theme">{{ title }}</p>
      <div class="card-answers">
        <div
          v-for="(question, indexQ) in currentQuestions"
          :key="`question-${indexQ}`"
          class="answers"
          :class="{'answers-non': (indexQ % 2) === 0}"
        >
          <span class="question-number" @click="goToQuestion(question.index)">{{ question.index + 1 }}</span>
          <span
            class="ovoid"
            :class="{'selected-answer': answer.id === question.answer}"
            v-for="(answer, indexA) in question.answers"
            :key="`question-${indexA}-answ-${indexA}`"
            @click="setAnswer(question, answer)"
          >
            {{ String.fromCharCode(64 + answer.id) }}
          </span>
        </div>
      </div>
    </div>
    <div class="pagination">
      <span
        v-for="page in countPages"
        :key="`page-${page}`"
        :class="{'selected-page': (page === currentPage + 1)}"
        @click="$emit('onChangePage', page - 1)"
      >
        {{ page }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentQuestions: {
      type: Array,
      required: true
    },
    countPages: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      title: 'Sesión desconocida del examen'
    }
  },
  methods: {
    setAnswer (question, answer) {
      const payload = {
        index: question.index,
        value: answer.id
      }
      this.$store.commit('simulators/setQuestionResponse', payload)
      this.goToQuestion(question.index)
    },
    goToQuestion (index) {
      location.href = `#question-${index}`
    }
  },
  created () {
    const session = localStorage.getItem('session')
    if (session === '1') {
      this.title = 'PRIMERA PARTE'
    } else if (session === '2') {
      this.title = 'SEGUNDA PARTE'
    }
  }
}
</script>
