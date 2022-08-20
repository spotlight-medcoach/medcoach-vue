<template>
	<div id="dashboard" class="h-100 p-2" :class="freeTrial.isTrialEnd ? 'trial-end' : 'trial'">
		<!--  MAIN CONTENT (LEFT) -->
		<section class="general-container d-inline-flex flex-column py-2">
			<!------------------------------------------------------------------------ QUOTE -->
			<article class="shadow-sm mx-2 mb-3">
				<motivational-quote />
			</article>
			<!------------------------------------------------------------------------ PHASE PROGRESS BAR -->
			<article class="shadow-sm p-4 mx-2 mb-2">
				<phases-index />
			</article>
			<!------------------------------------------------------------------------ CALENDAR -->
			<article v-if="!freeTrial.isTrialEnd" class="shadow-sm p-4 mx-2 mt-2 flex-grow-1">
				<div v-if="onHttpRequest" class="w-100">
					<loading-state :message="message" height="40vh" />
				</div>
				<div v-else-if="errorHttp" class="w-100 about quote" align="center">
					<p>Refresca la página en un momento, disculpa las molestias</p>
				</div>
				<dashboard-calendar v-else class="w-100" />
			</article>
		</section>
		<section v-if="!freeTrial.isTrialEnd" class="trial-panel-container shadow-sm p-3 m-2">
			<!----------------------------------------------------------------------- NOTIFICATIONS -->
			<dashboard-plan-panel />
		</section>
		<!------------------------------------------------------------------------ PAYMENT -->
		<dashboard-trial-end v-else class="subscription-container pb-2 px-2" />
	</div>
</template>
<script>

import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'

import MotivationalQuote from '~/components/_functional/motivationalQuote.vue'
import PhasesIndex from '@/components/phases/phasesIndex.vue'
import DashboardCalendar from '@/components/dashboard/DashboardCalendar.vue'
import DashboardPlanPanel from '~/components/dashboard/DashboardPlanPanel.vue'
import DashboardTrialEnd from '~/components/dashboard/DashboardTrialEnd.vue'

export default {
	name: 'DashboardTrial',
	components: {
		LoadingState,
		MotivationalQuote,
		PhasesIndex,
		DashboardCalendar,
		DashboardPlanPanel,
		DashboardTrialEnd
	},
	layout: 'new_default',
	computed: {
		...mapState({
			freeTrial: 'free_trial', // state completo en free_trial.js
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
		&.trial {
			grid-template-columns: 3fr minmax(340px, 1fr);
			grid-template-areas: "main trial"
		}
		&.trial-end {
			grid-template-rows: auto 1fr;
			grid-template-areas: "main" "subscription-container"
		}
		section.general-container {
			grid-area: main;
			overflow-y: auto;
		}
		section.trial-panel-container {
			grid-area: trial;
		}
		.shadow-sm {
			background-color: #fff;
		}
	}
</style>
