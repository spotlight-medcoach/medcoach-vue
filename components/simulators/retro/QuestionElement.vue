<template>
  <div
    class="answers w-100"
    :class="{'answers-non': (indexQ % 2) !== 0}"
    @click="goToQuestion(question.index)"
  >
    <span class="question-number">
      {{ question.index + 1 }}
    </span>
    <span
      class="ovoid"
      v-for="(answer, indexA) in question.answers"
      :class="{
        'retro-correct':  (answer.id === question.answer &&
                           answer.id === question.correct_answer),
        'retro-wrong': (answer.id === question.answer &&
                        answer.id !== question.correct_answer)
      }"
      :key="`question-${indexQ}-answ-${indexA}`"
    >
      {{ String.fromCharCode(64 + answer.id) }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    indexQ: {
      type: Number,
      required: true
    },
    question: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToQuestion (index) {
      this.$emit('onClickQuestion', index)
    }
  }
}
</script>
<style>
  .retro-correct {
    background-color: green !important;
  }
  .retro-wrong {
    background-color: red !important;
  }
</style>
