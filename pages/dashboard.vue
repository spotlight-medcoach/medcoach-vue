<template>
	<div id="dashboard" class="p-2">
		<!--  MAIN CONTENT (LEFT) -->
		<section class="general-container">
			<!------------------------------------------------------------------------ QUOTE -->
			<article class="shadow-sm m-2 mb-3">
				<motivational-quote />
			</article>
			<!------------------------------------------------------------------------ PHASE PROGRESS BAR -->
			<article class="shadow-sm p-4 m-2 mb-3">
				<phases-index />
			</article>
			<!------------------------------------------------------------------------ CALENDAR -->
			<article class="shadow-sm p-4 m-2">
				<div v-if="onHttpRequest" class="w-100">
					<loading-state :message="message" height="60vh" />
				</div>
				<div v-else-if="errorHttp" class="about quote" align="center">
					<p>Estamos diseñando tu plan de estudios personalizado, refresca la página en un momento, disculpa las molestias</p>
				</div>
				<template v-else>
					<second-phase v-if="alert_second_stage" />
					<third-phase v-else-if="alert_third_stage" />
					<dashboard-calendar v-else />
				</template>
			</article>
		</section>
		<!-- EXTRA CONTENT (TOP) -->
		<section class="notifications-container shadow-sm p-3 m-2">
			<!----------------------------------------------------------------------- NOTIFICATIONS -->
			<dashboard-notifications :loading="onHttpRequest" />
		</section>
		<!-------- EXTRA CONTENT (BOTTOM) -->
		<section class="simulators-container shadow-sm p-3 m-2">
			<!----------------------------------------------------------------------- SIMULATORS -->
			<dashboard-simulators :loading="onHttpRequest" />
		</section>
	</div>
</template>
<script>

import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'

import SecondPhase from '@/components/dashboard/SecondPhase.vue'
import ThirdPhase from '@/components/dashboard/ThirdPhase.vue'

import MotivationalQuote from '~/components/_functional/MotivationalQuote.vue'
import PhasesIndex from '@/components/phases/phasesIndex.vue'
import DashboardCalendar from '@/components/dashboard/DashboardCalendar.vue'
import DashboardNotifications from '@/components/dashboard/DashboardNotifications.vue'
import DashboardSimulators from '@/components/dashboard/DashboardSimulators.vue'

export default {
	components: {
		LoadingState,
		MotivationalQuote,
		PhasesIndex,
		SecondPhase,
		ThirdPhase,
		DashboardCalendar,
		DashboardNotifications,
		DashboardSimulators
	},
	layout: 'new_default',
	computed: {
		alert_third_stage () {
			if (this.rest_days && this.rest_days <= this.phase_3_days && this.phase.id !== 3) {
				return true
			} else {
				return false
			}
		},
		...mapState({
			rest_days: 'rest_days',
			phase_3_days: 'phase_3_days',
			syllabus: 'syllabus',
			phase: 'phase',
			alert_second_stage: 'alert_second_stage',
			onHttpRequest: state => state.http_request.onHttpRequest,
			message: state => state.http_request.message,
			errorHttp: state => state.http_request.errorHttp
		})
	}
}
</script>
<style lang="scss" scoped>
	#dashboard {
		display: grid;
		grid-template-columns: 3fr minmax(340px, 1fr);
		grid-auto-rows: 3fr 2fr;
		grid-template-areas:
			"main notifications"
			"main simulators";
		.general-container {
			grid-area: main;
			overflow-y: auto;
		}
		.notifications-container {
			grid-area: notifications;
		}
		.simulators-container {
			grid-area: simulators;
		}
		section.shadow-sm,
		article.shadow-sm {
			background-color: #fff;
			> div {
				height: 100%;
			}
		}
	}
</style>
