<template>
  <div class="test-cases">
    <div v-for="(_case, indexC) in cases" :key="`case-${indexC}`">
      <p class="title">CASO</p>
      <p v-html="_case.html"></p>
      <div class="questions">
        <div
          :id="`question-${question.index}`"
          v-for="(question, indexQ) in _case.questions"
          :key="`case-${indexC}-q-${indexQ}`"
          class="test-question"
        >
          <p class="title">PREGUNTA {{ question.index + 1 }}</p>
          <p v-html="question.html"></p>
          <div class="answers">
            <p
              v-for="(answer, indexA) in question.answers"
              :key="`case-${indexC}-q-${indexQ}-a-${indexA}`"
              v-html="answer.html"
              :class="{'selected-answer': answer.id === question.answer}"
            >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'test-questions',
  props: {
    cases: {
      type: Array,
      required: true
    }
  }
}
</script>
