<template>
  <div align="left" class="custom-progress" :class="phaseVariant.componentStyle">
    <div class="text-lg-content font-weight-utra-bolder">
      {{ averageValue }}%
    </div>
    <b-progress
      :max="totalValue"
      :value="actualValue"
      :precision="2"
      class="mb-2 mt-1"
    />
    <div class="fase-scope d-inline-flex align-items-center">
      <h3 class="subheader-lg pr-2 font-weight-utra-bolder">
        {{ phaseVariant.title }}
      </h3>
      <h4 class="subheader-xs font-weight-utra-bolder">
        ({{ phaseVariant.totalDays }} días)
      </h4>
    </div>
    <div class="fase-overview">
      <p class="text-xs-content font-weight-utra-bolder">
        {{ phaseVariant.textOverview }}
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { phaseVariants } from './data'

export default {
  name: 'PhasesPhase',
  props: {
    currentPhase: {
      type: Number,
      default: 0
    }
  },
  data () {
    moment.locale('es')
    return {
      now: moment()
    }
  },
  computed: {
    moment_init_phase_2 () {
      return moment(this.phase.init_date_phase_2)
    },
    phaseVariant () { // watch it
      return phaseVariants[this.currentPhase]
    },
    actualValue () {
      let value = 0
      switch (this.phase.id) {
        case 1:
          value = this.phase.progress
          break
        case 2: // fecha_actual - fecha_inicio_fase_II
          value = this.now.diff(this.moment_init_phase_2, 'days')
          break
        case 3: // 40 dias - restDays
          value = this.$store.state.phase_3_days - this.restDays
          break
      }
      return value
    },
    totalValue () {
      let value = 0
      switch (this.phase.id) {
        case 1:
          value = this.phase.total
          break
        case 2: // fecha_examen - 40 dias - fecha_inicio_fase II - 1 dia extra
          value = this.moment_test_date.diff(this.moment_init_phase_2, 'days') - this.$store.state.phase_3_days - 1
          break
        case 3:
          value = this.$store.state.phase_3_days
          break
      }
      return value
    },
    restDays () {
      let days = 0
      days = this.moment_test_date.diff(this.now, 'days') // fecha_test - fecha_actual
      if (days < 0) {
        days = 0
      }
      this.$store.commit('setRestDays', days)
      return days
    },
    averageValue () {
      let average = 0
      if (this.totalValue !== 0) {
        const aux = ((this.actualValue / this.totalValue) * 100)
        if (aux > 9) {
          average = Math.floor(aux)
        } else {
          average = aux.toFixed(1)
        }
      }
      return average
    },
    ...mapState({
      student: 'studentInfo',
      phase: 'phase'
    })
  }
}
</script>

<style lang="scss">
  .progress {
    height: 11px;
    border-radius: 2px;
  }
  .accent_b {
    color: #43B6F4;
    .progress {
      border: 1px solid #43B6F4;
      background-color: #F2FEFF;
      .progress-bar {
        background-color: #43B6F4;
      }
    }
  }
  .primary {
    color: #ff9300;
    .progress {
      border: 1px solid #ff9300;
      background-color: #FFF8E2;
      .progress-bar {
        background-color: #ff9300;
      }
    }
  }
  .accent_a {
    color: #ff39aa;
    .progress {
      border: 1px solid #ff39aa;
      background-color: #FFEEF1;
      .progress-bar {
        background-color: #ff39aa;
      }
    }
  }
</style>
