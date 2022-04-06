<template>
	<section id="creating" class="d-flex flex-column align-items-center justify-content-center">
		<div class="loading-animation">
			<lottie-player
				ref="loading-animation"
				class="loading-animation"
				background="transparent"
				mode="normal"
				speed="1"
				loop
				autoplay
			/>
		</div>
		<article class="text-center">
			<div class="heading-4">Estamos preparando tu plan de estudios</div>
			<div class="body-title-1 my-4 text-primary">Esto puede demorar unos minutos.  No cierres la pestaña durante este proceso.</div>
			<p class="body-xlg my-3">
				Estamos interpretando tus respuestas y utilizando nuestros algoritmos para definir un plan personalizado para ti.
			</p>
			<b-progress :value="progress" :max="finishOn" variant="secondary" :striped="true" />
			<p class="body-xlg my-3">
				Nuestro algoritmo crea un plan de estudio progresivo e inteligente. Se adapta a tu avance diario y a tus días libres para redistribuir el contenido pendiente a lo largo de todo el plan. Evitando así sobrecargarte con información.
			</p>
		</article>
	</section>
</template>
<script>
export default {
	layout: 'diagnostic_test_layout',
	data () {
		return {
			progress: 0,
			timelapse: 500,
			finishOn: 60000,
			progressListener: undefined
		}
	},
	mounted () {
		this.progressListener = setInterval(function () { // Medidor de progreso y espera para redirección a dashboard
			this.progress += this.timelapse
			if (this.progress >= this.finishOn) { // cuando el "progress" es mayor o igual a "finishOn" detiene el proceso
				clearInterval(this.progressListener)
				this.initializeDashboard()
			}
		}.bind(this), this.timelapse)

		setTimeout(() => { // Espera para cargar lotti
			const successLottie = require('@/assets/lotties/loading_creating.json')
			this.$refs['loading-animation'].load(successLottie)
		}, 500)
	},
	methods: {
		updateProfile () {
			this.$store.dispatch('initialize')
			const tokenUser = localStorage.getItem('usertoken')
			this.$router.push({ name: 'welcome', query: { token: tokenUser } })
		},
		initializeDashboard () {
			this.$store.dispatch('initialize').then(() => {
				this.$router.push({ path: '/dashboard' })
			})
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/_student_main.scss';
	#creating {
		background: #fff;
		article {
			max-width: 960px;
			position: relative;
			z-index: 1;
		}
		.loading-animation {
			height: 340px;
			width: 340px;
			text-align: center;
			lottie-player {
				height: 100%;
			}
		}
	}
</style>
