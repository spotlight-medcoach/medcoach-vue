<template>
  <aside id="aside-questions-index" class="custom-card">
    <p
      v-if="retro"
      class="text-center header-md mb-32px"
    >
      <span>Calificación</span>
      <span>{{ testGrade }}</span>
      <span>( {{ `${correctAnswers}/${custom_test.questions.length}` }} )</span>
    </p>
    <p v-else class="text-center header-md mb-32px">Preguntas</p>
    <div>
      <div
        class="question-element cursor-pointer"
        v-for="(question, index) in custom_test.questions"
        :key="`question-${index}`"
        :class="{
          'question-element-answered': question.response != 0,
          'question-element-current' : question.case_id == caseId,
          'question-element-correct' : (retro && question.correct_answer === question.response),
          'question-element-incorrect' : (retro && question.correct_answer !== question.response)
        }"
        @click="goToCase(question.case_id)"
      >
        <div class="question-element-container">
          <RedFlagIcon
            v-if="question.marked"
            class="mx-auto"
          />
          <span
            v-else
            class="question-element-radio d-block mx-auto"
          />
          <span class="question-element-number mt-auto">{{ index + 1 }}</span>
        </div>
      </div>
    </div>
    <b-button
      v-if="!retro"
      class="mt-auto"
      variant="primary"
      @click="finishTest"
    >
      Terminar examen
    </b-button>
  </aside>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import RedFlagIcon from '@/components/icons/RedFlagIcon'

export default {
  props: {
    retro: {
      type: Boolean,
      default: false
    }
  },
  components: {
    RedFlagIcon
  },
  computed: {
    ...mapGetters({
      testGrade: 'custom_test/testGrade',
      correctAnswers: 'custom_test/correctAnswers'
    }),
    ...mapState({
      custom_test: state => state.custom_test.customTest,
      caseId: state => state.custom_test.caseId
    })
  },
  methods: {
    goToCase (caseId) {
      this.$store.commit('custom_test/setCaseId', caseId)
    },
    finishTest () {
      this.$store.dispatch('custom_test/sendAnswers')
        .then((response) => {
          console.clear()
          console.log(response)
          this.$toastr.success('Se guardaron sus respuestas correctamente', 'Éxito')
        })
        .catch((error) => {
          console.clear()
          console.log(error.response)
          this.$toastr.error('Hubo un error al enviar sus respuestas', 'Error')
        })
        .finally(() => {
          this.$router.push({ path: '/custom_test_config' })
        })
    }
  }
}
</script>
<style lang="scss">
#aside-questions-index {
  min-width: 364px;
  width: 364px;
  padding: 24px 16px 10px 18px;
  display: flex;
  flex-direction: column;

  .question-element {
    display: inline-block;
    margin: 0px 5.5px 15px 5.5px;

    &-container {
      display: flex;
      flex-direction: column;
      width: 30px;
      height: 60px;
      padding: 8px 0px;
      text-align: center;
      background: #FFFFFF;
      box-sizing: border-box;
      border: 1px solid #979797;
    }

    &-number {
      line-height: 15px;
      font-size: 17px;
      opacity: 0.3;
    }

    &-radio {
      width: 13px;
      height: 13px;
      background: #FFFFFF;
      border: 1px solid #FF9300;
      border-radius: 13px;
      position: relative;
      opacity: 0.3;
    }

    &-current {
      border: 2px solid #000000;
      .question-element-number {
        opacity: 1;
      }
    }

    &-answered {
      .question-element-number {
        opacity: 1;
      }

      .question-element-radio {
        opacity: 1;

        &::before {
          content: "";
          display: block;
          position: absolute;
          width: 7px;
          height: 7px;
          top: 2px;
          left: 2px;
          -moz-border-radius: 7.5px;
          -webkit-border-radius: 7.5px;
          border-radius: 7.5px;
          background-color: #FF9300;
        }
      }
    }

    &-correct {
      .question-element-container {
        background: #D7FDBF;
      }
    }

    &-incorrect {
      .question-element-container {
        background: rgba(255, 87, 79, 0.3)
      }
    }
  }
}
</style>
