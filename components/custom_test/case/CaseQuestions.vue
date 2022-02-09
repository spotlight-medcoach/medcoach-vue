<template>
  <section id="case-questions">
    <div
      class="questions"
      v-for="(question, index) in questions"
      :key="`quest-${index}`"
    >
      <div class="header-md mb-10px">
        Pregunta {{question.index + 1}}
      </div>
      <div v-html="question.content"></div>
      <div class="mb-40px">
        <div
          class="mb-10px position-relative d-flex cursor-pointer"
          v-for="(ans, index2) in question.answers"
          :key="`answer-radio-${caseSelected.id}-${index}-${index2}`"
        >
          <b-form-radio
            :disabled="retro && ans.id !== question.response"
            :id="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            :name="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            v-bind:value="ans.id"
            v-model="question.response"
            @change="setAnswer(question.index, question.response)"
            class="mr-16px cursor-pointer"
          />
          <!--
          <input
            :disabled="retro && ans.id !== question.response"
            type="radio"
            :id="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            :name="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            v-bind:value="ans.id"
            v-model="question.response"
            @change="setAnswer(question.index, question.response)"
          />
          -->
          <label
            :for="`answer-radio-${caseSelected.id}-${index}-${index2}`"
            v-html="ans.html"
            class="cursor-pointer"
            :class="{
              'correct': (retro && question.correct_answer === ans.id),
              'incorrect': (retro && ans.id !== question.correct_answer)
            }"
          />
        </div>
      </div>
      <!-- RETRO -->
      <div v-if="retro" class="mb-5">
        <div class="header-md mb-10px">Retroalimentación</div>
        <div v-html="question.retro"></div>
      </div>
      <!-- FIN RETRO -->
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    retro: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      questions: []
    }
  },
  computed: {
    ...mapGetters({
      questionsByCase: 'custom_test/questionsByCase',
      caseSelected: 'custom_test/caseSelected'
    })
  },
  watch: {
    questionsByCase (newVal) {
      if (newVal) {
        this.questions = JSON.parse(JSON.stringify(this.questionsByCase))
      }
    }
  },
  methods: {
    setAnswer (questionIndex, response) {
      this.$store.commit('custom_test/setQuestionResponse', { index: questionIndex, value: response })
    }
  },
  mounted () {
    this.questions = JSON.parse(JSON.stringify(this.questionsByCase))
  }
}
</script>
<style lang="scss">
#case-questions {
  padding-bottom: 60px;
  border-bottom: 1px solid #979797;

  .questions {
    .incorrect {
      color: red;
    }
    .correct {
      color: green;
      font-weight: bold;
    }
    .icono {
      top: -2px;
      position: absolute;
    }
  }
}
</style>
