<template>
  <div id="phases-progress" :class="isFreeTrial ? 'free-trial' : 'default'">
    <b-skeleton-wrapper :loading="onHttpRequest">
      <!-- PHASES LOADING -->
      <template #loading>
        <div>
          <b-skeleton width="40%" type="button" class="mb-5" />
        </div>
        <div class="phases-container">
          <div v-for="block in isFreeTrial ? 1 : 3" :key="block">
            <b-skeleton width="18%" />
            <b-skeleton width="100%" />
            <b-skeleton :width="`${skeletonWidth(40, 80)}%`" />
          </div>
        </div>
      </template>
      <template v-if="errorHttp">
        <p>
          Estamos recalculando tu avance, refresca la página en un momento,
          disculpa las molestias
        </p>
      </template>
      <!-- END PHASES LOADING -->
      <template v-else>
        <!-- PHASES CONTENT (no trial) -->
        <template v-if="!isFreeTrial">
          <div class="d-flex justify-content-between">
            <h3 class="body-title-1">Fase de estudio</h3>
            <div class="text-right">
              <h4 class="body-medium-1">{{ restDays }} días restantes ENARM</h4>
              <p v-if="student" class="body-xsm">
                Calculado al {{ testDate.format('DD [de] MMMM [del] YYYY') }}
              </p>
            </div>
          </div>
          <div class="phases-container">
            <div
              v-for="(p, phaseId) in calcPhasesForStudent()"
              :key="phaseId"
              class="my-2"
            >
              <custom-progress-bar
                :actual-value="p.progress"
                :total-value="p.total"
                :top-hint="calcAverageValue(p.total, p.progress) + '%'"
                :color-variant="p.componentStyle"
                :bottom-header="p.title"
                :bottom-subheader="`( ${p.total - p.progress} ${p.scope} )`"
                :bottom-hint="p.textOverview"
                :enabled="isEnablePhase(phaseId)"
              />
            </div>
          </div>
        </template>
        <!-- PHASES CONTENT (trial) -->
        <template v-else-if="student">
          <div v-if="freeTrial" class="d-flex justify-content-between">
            <h3 class="body-title-1 mx-auto">
              {{
                !freeTrial.isTrialEnd
                  ? `Prueba de ${freeTrial.totalDuration} días`
                  : 'Tu prueba ha terminado'
              }}
            </h3>
            <div v-if="!freeTrial.isTrialEnd" class="text-right flex-grow-1">
              <h4 class="body-medium-1">{{ restDays }} días restantes ENARM</h4>
              <!-- <p class="body-xsm"> Calculado al {{ testDate.format('DD [de] MMMM [del] YYYY') }} </p> -->
            </div>
          </div>
          <div class="phases-container">
            <div :set="(p = calcTrialProgress())" class="my-2">
              <custom-progress-bar
                :actual-value="p.progress"
                :total-value="p.total"
                :top-hint="calcAverageValue(p.total, p.progress) + '%'"
                :color-variant="p.componentStyle"
                :bottom-header="p.title"
                :bottom-subheader="'( ' + p.progress + ' días )'"
                :bottom-hint="p.textOverview"
              />
            </div>
          </div>
        </template>
      </template>
    </b-skeleton-wrapper>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { phaseVariants } from './phasesStaticData';
import { getRandomNumberBetween } from '@/helpers/skeleton';
import CustomProgressBar from '~/components/_functional/customProgressBar.vue';
export default {
  name: 'PhasesIndex',
  components: {
    CustomProgressBar,
  },
  data () {
    moment.locale('es');
    return {
      now: moment(),
    };
  },
  computed: {
    testDate () {
      return moment(this.student.test_date);
    },
    ...mapState({
      student: 'studentInfo',
      phase: 'phase',
      phase_3_days: 'phase_3_days',
      isFreeTrial: 'isFreeTrial', // variable en index.js
      freeTrial: 'free_trial', // state completo en free_trial.js
      restDays: 'restDays',
      onHttpRequest: (state) => state.http_request.onHttpRequest,
      message: (state) => state.http_request.message,
      errorHttp: (state) => state.http_request.errorHttp,
    }),
  },
  methods: {
    skeletonWidth (min, max) {
      return getRandomNumberBetween(min, max);
    },
    isEnablePhase (phaseRefId) {
      return phaseRefId <= this.phase.id;
    },
    calcAverageValue (totalValue, actualValue) {
      // Validar que los valores sean números válidos y positivos
      if (!totalValue || !actualValue || totalValue <= 0 || actualValue < 0) {
        return 0;
      }
      // Calcular el porcentaje y limitarlo a un máximo de 100%
      const percentage = (actualValue / totalValue) * 100;
      return Math.min(+parseFloat(percentage.toFixed(2)), 100);
    },
    calcTrialProgress () {
      return {
        title: `Prueba de ${this.freeTrial.totalDuration} días`,
        textOverview:
          'Estudiar manuales y realizar notas / flashcards de todos los temas',
        componentStyle: 'blue',
        total: this.freeTrial.totalDuration,
        progress: this.freeTrial.restDays,
      };
    },
    calcPhasesForStudent () {
      const phasesContent = phaseVariants;
      phasesContent[3].total = this.phase_3_days;

      // Normalizar valores negativos o inválidos del phase
      const normalizedProgress = Math.max(0, this.phase.progress || 0);
      const normalizedTotal = Math.max(1, this.phase.total || 1);

      switch (this.phase.id) {
        case 1: {
          // fase I tiene una duración elástica que se determina a partir del día de inicio hasta terminar los manuales
          const phase1Total =
            normalizedProgress > normalizedTotal
              ? normalizedProgress
              : normalizedTotal;
          // Días restantes de fase 1 (lo que muestra el subheader)
          const phase1Remaining = phase1Total - normalizedProgress;
          // Estimación de fase 2: días restantes ENARM - días restantes fase 1 - 40 días de fase 3
          const phase2Estimate = Math.max(
            1,
            (this.restDays || 0) - phase1Remaining - this.phase_3_days,
          );
          Object.assign(phasesContent[1], {
            total: phase1Total,
            progress: normalizedProgress,
          });
          Object.assign(phasesContent[2], {
            total: phase2Estimate,
            progress: 0,
          });
          break;
        }
        case 2: {
          // fase_II tiene una duración a partir del día de terminada fase_I hasta el comienzo de fase_III
          // fecha_actual - fecha_inicio_fase_II
          Object.assign(phasesContent[1], {
            total: 1,
            progress: 1,
          });
          Object.assign(phasesContent[2], {
            total:
              normalizedProgress > normalizedTotal
                ? normalizedProgress
                : normalizedTotal,
            progress: normalizedProgress,
          });
          break;
        }
        case 3: {
          // fase_III tiene una duración fija de 40 días
          // el progreso se determina a partir de cuánto tiempo queda antes del exámen final
          Object.assign(phasesContent[1], {
            total: 1,
            progress: 1,
          });
          Object.assign(phasesContent[2], {
            total: 1,
            progress: 1,
          });
          Object.assign(phasesContent[3], {
            total:
              normalizedProgress > normalizedTotal
                ? normalizedProgress
                : normalizedTotal,
            progress: normalizedProgress,
          });
          break;
        }
      }
      return phasesContent;
    },
  },
};
</script>
<style lang="scss">
.default .phases-container {
  display: grid;
  grid-template-columns: 3fr 4fr 3fr;
  gap: 7px;
}
</style>
