<!-- eslint-disable vue/no-v-html -->
<template>
  <section id="diagnostic-test-question">
    <div class="questions">
      <div class="mb-40px">
        <div
          v-for="(ans, index2) in question.id.answers"
          :key="`answer-radio-${index2}`"
          class="mb-1 position-relative d-flex"
        >
          <b-form-radio
            :id="`answer-radio-${index2}`"
            v-model="response"
            :name="`answer-radio-${index2}`"
            :value="ans.id"
            class="mr-16px cursor-pointer"
            @change="setAnswer"
          />
          <label
            :id="`answer-label-${index2}`"
            :for="`answer-radio-${index2}`"
            class="cursor-pointer"
            v-html="ans.html"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      response: -1,
    };
  },
  watch: {
    'question._id' (newVal) {
      if (newVal) {
        this.response = this.question.response;
      }
    },
  },
  created () {
    this.response = this.question.response;
  },
  methods: {
    setAnswer () {
      this.$emit('onSetResponse', this.response);
    },
  },
};
</script>
<style lang="scss">
#diagnostic-test-question {
  padding-bottom: 60px;

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
