<template>
  <section id="case-timer" class="custom-card p-0">
    <p>
      {{ selectedQuestion.time }}
    </p>
    <div
      v-if="retro"
      class="case-timer-container case-timer-retro"
    >
      <p>
        <span>Respuesta correcta:</span>
        <span>{{ String.fromCharCode(64 + selectedQuestion.correct_answer) }}</span>
      </p>
      <p>
        <StatisticsIcon />
        <span>{{ testGrade }}%</span>
        <span>Contesto correctamente</span>
      </p>
      <!--
      <p>
        <ClockIcon />
        <span>Tiempo en contestar: </span>
        <span>79 s</span>
      </p>
      -->
    </div>
    <div
      v-else
      class="case-timer-container"
    >
      <div
        :class="{
          'invisible': !timerString
        }"
      >
        <span>Tiempo: </span>
        <span>{{ timerString }}</span>
      </div>
      <div
        class="d-flex align-items-center"
      >
        <span class="mr-16px">Marcar pregunta</span>
        <ToggleSwitch
          v-model="question.marked"
        />
      </div>
    </div>
  </section>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import StatisticsIcon from '@/components/icons/StatisticsIcon'
// import ClockIcon from '@/components/icons/ClockIcon'

export default {
  props: {
    retro: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ToggleSwitch,
    StatisticsIcon
    // ClockIcon
  },
  data () {
    return {
      question: {
        marked: false
      }
    }
  },
  watch: {
    selectedQuestion (newVal) {
      if (newVal) {
        this.question = JSON.parse(JSON.stringify(newVal))
      }
    },
    'question.marked' (value) {
      this.$store.commit('custom_test/setQuestionMark', {
        index: this.question.index,
        value
      })
    }
  },
  computed: {
    ...mapGetters({
      testGrade: 'custom_test/testGrade',
      selectedQuestion: 'custom_test/selectedQuestion'
    }),
    ...mapState({
      timerString: state => state.custom_test.timerString
    })
  },
  mounted () {
    this.question = JSON.parse(JSON.stringify(this.selectedQuestion))
  }
}
</script>
<style lang="scss">
  #case-timer {
    .case-timer-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 24px;
      font-size: 20px;
      line-height: 24px;
      width: 100%;
      label {
        margin-bottom: 0px;
      }
    }

    .case-timer-retro {
      font-size: 17px;
    }
  }
</style>
