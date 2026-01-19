<template>
  <section id="case-questions">
    <div class="questions">
      <div class="body-title-1">Pregunta {{ question.index + 1 }}</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="question.content" />
      <div class="answers-container">
        <div
          v-for="(ans, index2) in question.answers"
          :key="`answer-radio-${caseSelected.id}-${question.index}-${index2}`"
          class="position-relative d-flex cursor-pointer"
        >
          <b-form-radio
            :id="`answer-radio-${caseSelected.id}-${question.index}-${index2}`"
            v-model="question.response"
            :disabled="retro && ans.id !== question.response"
            :name="`answer-radio-${caseSelected.id}-${question.index}`"
            :value="ans.id"
            class="mr-16px cursor-pointer"
            @change="setAnswer(question.index, question.response)"
          />
          <label
            :for="`answer-radio-${caseSelected.id}-${question.index}-${index2}`"
            class="cursor-pointer"
            :class="{
              correct: retro && question.correct_answer === ans.id,
              incorrect: retro && ans.id !== question.correct_answer,
            }"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="ans.html" />
          </label>
        </div>
      </div>
      <!-- RETRO -->
      <div v-if="retro" class="mb-5">
        <div class="body-title-1 mb-10px">Retroalimentación</div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="question.retro" />
      </div>
      <!-- FIN RETRO -->
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    retro: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      question: {},
      stop_timing: false,
    };
  },
  computed: {
    ...mapGetters({
      questionsByCase: 'custom_test/questionsByCase',
      caseSelected: 'custom_test/caseSelected',
      selectedQuestion: 'custom_test/selectedQuestion',
    }),
  },
  watch: {
    selectedQuestion (newVal) {
      if (newVal) {
        if (!this.retro) {
          this.$store.commit('custom_test/setQuestionTime', {
            index: this.selectedQuestion.index,
            value: 0,
          });
        }
        this.question = JSON.parse(JSON.stringify(newVal));
      }
    },
  },
  mounted () {
    this.question = JSON.parse(JSON.stringify(this.selectedQuestion));
    if (!this.retro) {
      this.addSecondToSelectedQuestion();
    }
  },
  methods: {
    setAnswer (questionIndex, response) {
      this.$store.commit('custom_test/setQuestionResponse', {
        index: questionIndex,
        value: response,
      });
    },
    async addSecondToSelectedQuestion () {
      if (this.selectedQuestion) {
        const time = this.selectedQuestion.time + 1;
        this.$store.commit('custom_test/setQuestionTime', {
          index: this.selectedQuestion.index,
          value: time,
        });
      }
      if (this.stop_timing) {
        return false;
      }
      return await setTimeout(() => {
        return this.addSecondToSelectedQuestion();
      }, 1000);
    },
  },
};
</script>
<style lang="scss">
#case-questions {
  padding-bottom: 60px;
  border-bottom: 1px solid #979797;

  .questions {
    display: flex;
    flex-direction: column;
    gap: 16px;
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

  .answers-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
