<template>
 <b-container class="bottomBorder pb-4 mb-4">
  <b-row cols="12" cols-sm="12" cols-md="12" cols-lg="12" align="left">
    <b-col cols="10">
      <br>
      <h3><b>Fase {{ phase.id }}</b></h3>
      <div align="left" class="custom-progress">
        <b-progress
          :max="totalValue"
          :precision="2"
          show-progress
          class="mb-3 mt-3"
        >
          <b-progress-bar :value="actualValue">
            <div class="percent-container d-flex flex-row-reverse">
              <div class="circle">
                {{ averageValue }}%
              </div>
            </div>
          </b-progress-bar>
        </b-progress>
      </div>
    </b-col>
    <b-col cols="2" style="padding-right: 0px;">
      <div align="center">
        <h1><b>{{ restDays }}</b></h1>
        <p style="font-size:20px"><b>Días restantes</b></p>
        <p style="font-size:11px">Calculado al {{ moment_test_date.format('DD [de] MMMM [del] YYYY') }}</p>
      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import moment from 'moment'

export default {
  name: 'phases-index',
  props: {
    student: {
      type: Object,
      required: true
    },
    phase: {
      type: Object,
      required: true
    }
  },
  data () {
    moment.locale('es')
    return {
      now: moment()
    }
  },
  computed: {
    moment_test_date () {
      return moment(this.student.test_date)
    },
    moment_init_phase_2 () {
      return moment(this.phase.init_date_phase_2)
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
    }
  }
}
</script>

<style>
  .custom-progress .progress {
    border-radius: 128px !important;
    height: 20px !important;
    background-color: #C4C4C4 !important;
  }
  .custom-progress .progress .progress-bar {
    background-color: #1CA4FC !important;
    border-radius: 0.5rem !important;
    min-width: 3%;
  }
  .percent-container {
    width: 100%;
    height: 100%;
  }
  .percent-container .circle {
    height: 38px;
    width: 38px;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    color: #1CA4FC;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    border: 2px solid #1CA4FC;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    top: 65px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 39px;
  }
</style>
