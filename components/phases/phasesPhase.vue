<template>
  <custom-progress-bar
    :actualValue = actualValue
    :totalValue = totalValue
    :topHint = "averageValue + '%'"
    :colorVariant = phaseVariant.componentStyle
    :bottomHeader = phaseVariant.title
    :bottomSubheader = "'( ' + phaseVariant.totalDays + ' días)'"
    :bottomHint = phaseVariant.textOverview
    v-if="phaseVariant"
  />
</template>

<script>

import moment from 'moment'
import { mapState } from 'vuex'
import { phaseVariants } from './phasesStaticData'
import CustomProgressBar from '@/components/_functional/customProgressBar.vue'

export default {
  name: 'PhasesPhase',
  components: {
    CustomProgressBar
  },
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
