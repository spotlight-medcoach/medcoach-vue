<template>
	<div id="payment" class="p-3">
		<!-- BACK TO DASHBOARD -->
		<div class="back-dashboard shadow-sm p-2"><!-- Topic Progress column -->
			<b-button
				nuxt-link
				to="/dashboard"
				variant="link"
				class="text-dark text-decoration-none"
			>
				<b-icon class="text-gray" icon="chevron-left" />
				<span>Regresar</span>
			</b-button>
		</div>
		<template v-if="!selectedPlan">
			<!-- BENEFITS LOADER -->
			<section class="benefits-container d-flex flex-column align-items-center justify-content-center shadow-sm p-5">
				<article>
					<loading-state />
				</article>
			</section>
			<!-- PAYMENT LOADER -->
			<section class="payment-container d-flex flex-column align-items-center justify-content-center shadow-sm p-2"><!-- Manual List column -->
				<loading-state />
			</section>
		</template>
		<template v-else>
			<!-- BENEFITS -->
			<section class="benefits-container d-flex flex-column align-items-center justify-content-center shadow-sm p-5">
				<article>
					<dl class="body-xxlg">
						<dt class="my-2">2 exámenes diagnósticos *</dt>
						<dt class="my-2">3 simuladores tipo ENARM</dt>
						<dt class="my-2">Algoritmo BrainWave</dt>
						<dt class="my-2">Flashcards + notas inteligentes</dt>
						<dt class="my-2">+600 temas dirigidos al ENARM</dt>
						<dt class="my-2">+3,500 preguntas formato ENARM</dt>
					</dl>
					<hr class="ml-0 mb-1">
					<p class="heading-2">${{selectedPlan.amount}}</p>
					<span class="body-md ml-4">mensuales</span>
					<ul class="body-lg mt-5">
						<li class="my-3">Acceso a la plataforma el tiempo que quieras mientras te encuentres suscrito</li>
						<li class="my-3">Puedes cancelar tu suscripción y volver cuando desees, tus notas y progreso se quedarán guardados</li>
						<li class="my-3">El número de exámenes diagnóstico y fase a seleccionar varia acorde al tiempo de inicio de curso</li>
					</ul>
				</article>
			</section>
			<!-- PAYMENT -->
			<section class="payment-container d-flex flex-column align-items-center justify-content-center shadow-sm p-2"><!-- Manual List column -->
				<conekta-frame v-if="selectedPlan.id" :planId="selectedPlan.id" class="w-100" />
			</section>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import ConektaFrame from '@/components/ConektaFrame.vue'
export default {
	components: {
		LoadingState,
		ConektaFrame
	},
	layout: 'new_default',
	computed: {
		selectedPlan () {
			return this.subscriptionPlans.find(plan => plan.id === this.$route.query.plan)
		},
		...mapState({
			subscriptionPlans: state => state.payment.subscriptionPlans
		})
	}
}
</script>

<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	#payment {
		min-height: 100%;
		display: grid;
		grid-template-columns: 1.76fr minmax(693px, 1fr);
		grid-template-rows: auto 1fr;
		grid-template-areas: 'plan-back plan-pay' 'plan-detail plan-pay';
		gap: 1rem;
		> *
		{
			&.shadow-sm {
				background-color: #fff;
			}
			&:nth-child(1) {
				grid-area: plan-back;
			}
			&:nth-child(2) {
				grid-area: plan-detail;
			}
			&:nth-child(3) {
				grid-area: plan-pay;
			}
		}
	}
	.back-dashboard {
		.b-icon {
			color: $neutral-400;
		}
	}
	.benefits-container {
		> article {
			max-width: 676px;
			hr {
				max-width: 360px;
				border-color: #000;
			}
			ul {
				padding-left: 17px;
			}
		}
	}
</style>
