<template>
  <div id="test-cases" class="test-cases">
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
            <div
              v-for="(answer, indexA) in question.answers"
              :key="`case-${indexC}-q-${indexQ}-a-${indexA}`"
              class="d-flex align-items-center mb-2"
              :class="{
                'correct-answer': (retro && answer.id === question.correct_answer),
                'wrong-answer': (retro && answer.id !== question.correct_answer)
              }"
            >
              <input
                v-if="retro && answer.id === question.answer"
                :id="`case-${indexC}-q-${indexQ}-a-${indexA}`"
                :value="answer.id"
                v-model="question.answer"
                type="radio"
                class="mr-2"
              >
              <label
                :for="`case-${indexC}-q-${indexQ}-a-${indexA}`"
                :class="{
                  'ml-4': (retro && answer.id !== question.answer),
                  'selected-answer': (answer.id === question.answer && !retro)
                }"
                v-html="answer.html"
                class="mr-2"
              >
              </label>
              <span v-if="retro && answer.id === question.correct_answer" style="font-size: 20px">&check;</span>
              <span v-if="retro && answer.id !== question.correct_answer" style="font-size: 30px">&times;</span>
            </div>
            <div v-html="question.retro" v-if="retro" class="retro-content"></div>
            <!-- <p
              v-for="(answer, indexA) in question.answers"
              :key="`case-${indexC}-q-${indexQ}-a-${indexA}`"
              v-html="answer.html"
              :class="{'selected-answer': answer.id === question.answer}"
            >
            </p> -->
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
    },
    retro: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setAnswer (question, answer) {
      if (!this.retro) {
        this.$emit('onSetAnswer', { question, answer })
      }
    }
  }
}
</script>
