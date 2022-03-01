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
				<p>Estamos recalculando tu avance, refresca la página en un momento, disculpa las molestias</p>
			</template>
			<!-- END PHASES LOADING -->
			<template v-else>

				<!-- PHASES CONTENT (no trial) -->
				<template v-if="!isFreeTrial">
					<div class="d-flex justify-content-between">
						<h3 class="body-title-1"> Fase de estudio </h3>
						<div class="text-right">
							<h4 class="body-medium-1"> {{ restDays }} días restantes ENARM </h4>
							<p class="body-xsm"> Calculado al {{ testDate.format('DD [de] MMMM [del] YYYY') }} </p>
						</div>
					</div>
					<div class="phases-container">
						<div
							v-for="(p, phaseId) in calcPhasesForStudent()"
							:key="phaseId"
							class="my-2"
						>
							<custom-progress-bar
								:actual-value = "p.progress"
								:total-value = "p.total"
								:top-hint = "calcAverageValue(p.total, p.progress) + '%'"
								:color-variant = "p.componentStyle"
								:bottom-header = "p.title"
								:bottom-subheader = "'( ' + p.total + ' días )'"
								:bottom-hint = "p.textOverview"
								:enabled = "isEnablePhase(phaseId)"
							/>
						</div>
					</div>
				</template>

				<!-- PHASES CONTENT (trial) -->
				<template v-else-if="student">
					<div class="d-flex justify-content-between">
						<h3 class="body-title-1 mx-auto">
							{{!freeTrial.isTrialEnd ? `Prueba de ${freeTrial.totalDuration} días` : 'Tu prueba ha terminado'}}
						</h3>
						<div class="text-right flex-grow-1" v-if="!freeTrial.isTrialEnd">
							<h4 class="body-medium-1"> {{ restDays }} días restantes ENARM </h4>
							<!-- <p class="body-xsm"> Calculado al {{ testDate.format('DD [de] MMMM [del] YYYY') }} </p> -->
						</div>
					</div>
					<div class="phases-container">
						<div :set="p = calcTrialProgress()" class="my-2">
							<custom-progress-bar
								:actual-value = "p.progress"
								:total-value = "p.total"
								:top-hint = "calcAverageValue(p.total, p.progress) + '%'"
								:color-variant = "p.componentStyle"
								:bottom-header = "p.title"
								:bottom-subheader = "'( ' + p.progress + ' días )'"
								:bottom-hint = "p.textOverview"
							/>
						</div>
					</div>
				</template>

			</template>
		</b-skeleton-wrapper>
	</div>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { phaseVariants } from './phasesStaticData'
import { getRandomNumberBetween } from '@/helpers/skeleton'
import CustomProgressBar from '~/components/_functional/CustomProgressBar.vue'
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
		...mapState({
			student: 'studentInfo',
			phase: 'phase',
			phase_3_days: 'phase_3_days',
			isFreeTrial: 'isFreeTrial',
			freeTrial: 'free_trial',
			restDays: 'restDays',
			onHttpRequest: state => state.http_request.onHttpRequest,
			message: state => state.http_request.message,
			errorHttp: state => state.http_request.errorHttp
		})
	},
	methods: {
		skeletonWidth (min, max) {
			return getRandomNumberBetween(min, max)
		},
		isEnablePhase (phaseRefId) {
			return (phaseRefId <= this.phase.id)
		},
		calcAverageValue (totalValue, actualValue) {
			if (totalValue === 0 || actualValue === 0) {
				return 0
			}
			return +parseFloat(actualValue / totalValue * 100).toFixed(2)
		},
		calcTrialProgress () {
			return {
				title: `Prueba de ${this.freeTrial.totalDuration} días`,
				textOverview: 'Estudiar manuales y realizar notas / flashcards de todos los temas',
				componentStyle: 'blue',
				total: this.freeTrial.totalDuration,
				progress: this.freeTrial.restDays
			}
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
	.default .phases-container {
		display: grid;
		grid-template-columns: 3fr 4fr 3fr;
		gap: 7px;
	}
</style>
