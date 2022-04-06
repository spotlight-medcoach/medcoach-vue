<template>
	<div id="dashboard-promoted-plan" class="d-flex flex-column">
		<!-- TÍTULO -->
		<h2 class="body-title-1 text-center">Comienza tu suscripción</h2>
		<!-- BLOQUE SUPERIOR -->
		<article class="shadow-sm p-3 my-2 text-center">
			<p class="body-medium-3">Te quedan <br>aproximadamente</p>
			<p class="heading-1 text-secondary">{{restDays}}</p>
			<p class="body-medium-3">días</p>
			<p class="body-medium-3">para presentar el ENARM*</p>
		</article>
		<!-- BLOQUE INTERMEDIO -->
		<article class="shadow-sm p-3 my-2 text-center flex-grow-1 d-flex flex-column justify-content-between">
			<p class="body-medium-3">Continua tu estudio con <br>Medcoach</p>
			<div v-if="promotedPlan">
				<p class="heading-1">${{promotedPlan.amount}}</p>
				<p class="body-medium-3">mensuales</p>
			</div>
			<b-button v-if="promotedPlan" class="btn-sm mx-auto" variant="primary" :to="`/payment?plan=${promotedPlan.id}`"> Pagar suscripción </b-button>
		</article>
		<!-- BLOQUE INFERIOR -->
		<article class="shadow-sm p-3 my-2 text-center">
			<p class="body-medium-3">90% de los estudiantes con Medcoach consigueron su plaza</p>
		</article>
		<!-- NOTA -->
		<article class="mt-2 p-2 text-center">
			<p class="body-xs">Las fechas oficiales para el ENARM cambian año con año. Tomamos como referencia priliminar la fecha del año pasado.</p>
		</article>
	</div>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	name: 'DashboardCalendar',
	computed: {
		...mapState({
			restDays: 'restDays',
			promotedPlan: state => state.payment.promotedPlan
		})
	},
	mounted () {
		moment.locale('es')
	}
}
</script>
<style scoped>
#dashboard-promoted-plan {
	height: 100%;
}
</style>
