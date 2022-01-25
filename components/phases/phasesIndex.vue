<template>
  <div id="phases-progress">
    <b-skeleton-wrapper :loading="onHttpRequest">
      <!-- PHASES LOADING -->
      <template #loading>
        <div>
          <b-skeleton width="40%" type="button" class="mb-5" />
        </div>
        <div class="phases-container">
          <div>
            <b-skeleton width="40px" />
            <b-skeleton width="100%" />
            <b-skeleton width="300px" />
          </div>
          <div>
            <b-skeleton width="40px" />
            <b-skeleton width="100%" />
            <b-skeleton width="200px" />
          </div>
          <div>
            <b-skeleton width="40px" />
            <b-skeleton width="100%" />
            <b-skeleton width="400px" />
          </div>
        </div>
      </template>
      <template v-if="errorHttp">
        <p>Estamos recalculando tu avance, refresca la página en un momento, disculpa las molestias</p>
      </template>
      <!-- END PHASES LOADING -->
      <template v-else>
        <!-- PHASES TOP CONTENT -->
        <div class="d-flex justify-content-between">
          <h3 class="header-md">
            Fase de estudio
          </h3>
          <div v-if="student" class="text-right">
            <h4 class="header-md">
              {{ restDays }} días restantes ENARM
            </h4>
            <p class="text-xs-content">
              Calculado al {{ testDate.format('DD [de] MMMM [del] YYYY') }}
            </p>
          </div>
        </div>
        <!-- END PHASES TOP CONTENT -->
        <!-- PHASES CONTENT -->
        <div class="phases-container">
          <div
            v-for="(p, phaseId) in calcPhasesForStudent()"
            :key="phaseId"
            class="my-2"
          >
            <custom-progress-bar
              :actualValue = p.progress
              :totalValue = p.total
              :topHint = "calcAverageValue(p.total, p.progress) + '%'"
              :colorVariant = p.componentStyle
              :bottomHeader = p.title
              :bottomSubheader = "'( ' + p.total + ' días )'"
              :bottomHint = p.textOverview
              :enabled = isEnablePhase(phaseId)
            />
          </div>
        </div>
        <!-- END PHASES CONTENT -->
      </template>
    </b-skeleton-wrapper>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { phaseVariants } from './phasesStaticData'
import CustomProgressBar from '@/components/_functional/customProgressBar.vue'

export default {
  name: 'PhasesIndex',
  components: {
    CustomProgressBar
  },
  data () {
    moment.locale('es')
    return {
      now: moment()
    }
  },
  computed: {
    testDate () {
      return moment(this.student.test_date)
    },
    restDays () {
      return this.calcRestDays()
    },
    ...mapState({
      student: 'studentInfo',
      phase: 'phase',
      phase_3_days: 'phase_3_days',
      onHttpRequest: state => state.http_request.onHttpRequest,
      message: state => state.http_request.message,
      errorHttp: state => state.http_request.errorHttp
    })
  },
  methods: {
    calcRestDays () {
      let days = 0
      days = this.testDate.diff(this.now, 'days') // fecha_test - fecha_actual
      if (days < 0) {
        days = 0
      }
      this.$store.commit('setRestDays', days)
      return days
    },
    isEnablePhase (phaseRefId) {
      return (phaseRefId <= this.phase.id)
    },
    calcAverageValue (totalValue, actualValue) {
      let average = 0
      console.log(totalValue, actualValue)
      if (totalValue !== 0) {
        const aux = ((actualValue / totalValue) * 100)
        if (aux > 9) {
          average = Math.floor(aux)
        } else {
          average = aux.toFixed(1)
        }
      }
      return average
    },
    calcPhasesForStudent () {
      const phasesContent = phaseVariants
      phasesContent[3].total = this.phase_3_days
      switch (this.phase.id) {
        case 1: {
          // fase I tiene una duración elástica que se determina a partir del día de inicio hasta terminar los manuales
          Object.assign(phasesContent[1], {
            total: this.phase.total,
            progress: this.phase.progress
          })
          break
        }
        case 2: {
          // fase_II tiene una duración a partir del día de terminada fase_I hasta el comienzo de fase_III
          // fecha_actual - fecha_inicio_fase_II
          const initFase2 = this.now.diff(moment(this.phase.init_date_phase_2), 'days')
          Object.assign(phasesContent[2], {
            total: initFase2 - this.phase_3_days - 1,
            progress: initFase2
          })
          break
        }
        case 3: {
          // fase_III tiene una duración fija de 40 días
          // el progreso se determina a partir de cuánto tiempo queda antes del exámen final
          Object.assign(phasesContent[3], {
            total: this.phase_3_days,
            progress: this.phase_3_days - this.restDays
          })
          break
        }
      }
      return phasesContent
    }
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
