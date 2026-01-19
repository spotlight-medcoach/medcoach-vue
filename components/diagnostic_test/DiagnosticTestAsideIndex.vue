<template>
  <aside id="diagnostic-test-aside-index" class="custom-card">
    <p class="text-center body-title-1 mb-32px">Preguntas</p>
    <div>
      <div
        v-for="(question, index) in questions"
        :key="`question-${index}`"
        class="question-element cursor-pointer"
        :class="{
          'question-element-answered': question.response != -1,
          'question-element-current': question._id == selectedQuestion._id,
        }"
        @click="goToQuestion(index)"
      >
        <div
          class="question-element-container"
          :class="{
            'question-element-container-marked': question.marked,
          }"
        >
          <RedFlagIcon v-if="question.marked" class="mx-auto d-block" />
          <span v-else class="question-element-radio d-block mx-auto" />
          <span class="question-element-number mt-auto">{{ index + 1 }}</span>
        </div>
      </div>
    </div>
    <div class="mt-auto">
      <b-overlay spinner-small :show="loading">
        <b-button variant="primary" class="w-100" @click="finishTest">
          Terminar examen
        </b-button>
      </b-overlay>
    </div>
  </aside>
</template>
<script>
import RedFlagIcon from '@/components/icons/RedFlagIcon';

export default {
  components: {
    RedFlagIcon,
  },
  props: {
    questions: {
      type: Array,
      required: true,
    },
    selectedQuestion: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      loading: false,
    };
  },
  methods: {
    goToQuestion (index) {
      this.$emit('goToQuestion', index);
    },
    finishTest () {
      this.loading = true;
      this.$emit('onFinishTest');
    },
  },
};
</script>
<style lang="scss">
#diagnostic-test-aside-index {
  min-width: 450px;
  width: 450px;
  padding: 24px 16px 10px 18px;
  display: flex;
  flex-direction: column;

  .question-element {
    display: inline-block;

    &-container {
      margin: 0px 5.5px 15px 5.5px;
      display: flex;
      flex-direction: column;
      width: 30px;
      height: 60px;
      padding: 8px 0px;
      text-align: center;
      background: #ffffff;
      box-sizing: border-box;
      border: 1px solid #979797;
    }

    &-container-marked {
      padding: 4px 0px;
    }

    &-number {
      line-height: 15px;
      font-size: 17px;
      opacity: 0.3;
    }

    &-radio {
      width: 13px;
      height: 13px;
      background: #ffffff;
      border: 1px solid #ff9300;
      border-radius: 13px;
      position: relative;
      opacity: 0.3;
    }

    &-current {
      .question-element-container {
        border: 2px solid #000000;
      }
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
          content: '';
          display: block;
          position: absolute;
          width: 7px;
          height: 7px;
          top: 2px;
          left: 2px;
          -moz-border-radius: 7.5px;
          -webkit-border-radius: 7.5px;
          border-radius: 7.5px;
          background-color: #ff9300;
        }
      }
    }

    &-correct {
      .question-element-container {
        background: #d7fdbf;
      }
    }

    &-incorrect {
      .question-element-container {
        background: rgba(255, 87, 79, 0.3);
      }
    }
  }
}
</style>
