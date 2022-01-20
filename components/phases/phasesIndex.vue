<template>
  <section>
    <div class="d-flex justify-content-between">
      <h3 class="header-md">Fase de estudio</h3>
      <div class="text-right">
        <h4 class="header-md">{{ restDays }} días restantes ENARM</h4>
        <p class="text-xs-content">Calculado al {{ moment_test_date.format('DD [de] MMMM [del] YYYY') }}</p>
      </div>
    </div>
    <div class="phases-container">
      <div class="my-2">
        <phases-phase :currentPhase="1"/>
      </div>
      <div class="my-2">
        <phases-phase :currentPhase="2"/>
      </div>
      <div class="my-2">
        <phases-phase :currentPhase="3"/>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import phasesPhase from './phasesPhase.vue'

export default {
  components: {
    phasesPhase
  },
  name: 'phases-index',
  data () {
    moment.locale('es')
    return {
      now: moment()
    }
  },
  computed: {
    restDays () {
      let days = 0
      days = this.moment_test_date.diff(this.now, 'days') // fecha_test - fecha_actual
      if (days < 0) {
        days = 0
      }
      this.$store.commit('setRestDays', days)
      return days
    },
    moment_test_date () {
      return moment(this.student.test_date)
    },
    ...mapState({
      student: 'studentInfo'
    })
  }
}
</script>

<style lang="scss">
  .phases-container {
    display: grid;
    grid-template-columns: 3fr 4fr 3fr;
    gap: 7px;
  }
</style>
