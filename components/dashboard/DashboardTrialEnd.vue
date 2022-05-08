<template>
	<section>
		<article class="shadow-sm d-flex align-items-center justify-content-center p-3 text-center">
			<div>
				<p class="body-medium-3">Aún puedes estudiar</p>
				<p class="body-medium-3 my-3">Te quedan aproximadamente</p>
				<span class="heading-1 text-secondary my-3">{{restDays}}</span>
				<p class="body-medium-3 my-3">días</p>
				<p class="body-medium-3">para presentar el ENARM*</p>
			</div>
		</article>
		<article class="shadow-sm d-flex align-items-center justify-content-center p-3 text-center">
			<div v-if="promotedPlan">
				<p class="body-medium-3">Continua tu estudio con <br>Medcoach</p>
				<div class="my-3">
					<span class="heading-1 my-3">${{promotedPlan.amount}}</span>
					<p class="body-medium-3">mensuales</p>
				</div>
				<b-button class="btn-sm mx-auto my-3" variant="primary" :to="`/payment?plan=${promotedPlan.id}`"> Pagar suscripción </b-button>
			</div>
		</article>
		<article class="shadow-sm d-flex align-items-center justify-content-center p-3 text-center">
			<div>
				<p class="body-title-3">
					Las fechas oficiales para el ENARM cambian año con año. Tomamos como referencia priliminar la fecha del año pasado.
				</p>
			</div>
		</article>
		<article class="shadow-sm d-flex align-items-center justify-content-center p-3 text-center">
			<div>
				<p class="body-title-3">
					90% de los estudiantes con Medcoach consiguieron su plaza
				</p>
			</div>
		</article>
	</section>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'DashboardTrial',
	computed: {
		...mapState({
			restDays: 'restDays',
			promotedPlan: state => state.payment.promotedPlan
		})
	}
}
</script>
<style lang="scss" scoped>
	section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: 1fr auto;
		gap: 1rem;
	}
	.shadow-sm {
		background-color: #fff;
	}
	p {
		font-weight: 400 !important;
	}
</style>
