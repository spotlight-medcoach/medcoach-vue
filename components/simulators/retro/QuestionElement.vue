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
      :class="{'selected-answer': answer.id === question.answer}"
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
