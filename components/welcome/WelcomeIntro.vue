<template>
	<section class="w-100 h-100 d-flex align-items-center">
		<article>
			<div class="text-center">
				<lottie-player
					ref="welcome-intro"
					class="welcome-intro"
					background="transparent"
					mode="normal"
					speed="1"
					loop
					autoplay
				/>
			</div>
		</article>
		<article>
			<div class="text-center">
				<h2 class="body-xxxlg">
					Necesitamos evaluar tu conocimiento
				</h2>
				<p class="my-4">
					Contesta el siguiente examen diagnóstico el cual consta de 100 preguntas. Este examen sirve para crear tu calendario personalizado, por lo que no cuenta con calificación ni retroalimentación.
				</p>
				<p class="my-4">
					Este examen no tiene una extensión de tiempo, pero es importante que no cambies de computadora, ya que no podrás salir de la sesión durante el examen. No puedes comenzar el examen en un dispositivo y continuarlo en otro.
				</p>
				<p class="my-4">
					Algunas recomendaciones antes de iniciarlo: Destina un espacio y tiempo a contestar este examen, recuerda que deberás de tener una conexión a internet estable. No te desesperes si no conoces la respuesta, el examen está diseñado para que muestres tus puntos débiles y poder trabajar en ellos durante tu estudio.
				</p>
				<p class="my-4">
					¡Mucho éxito!
				</p>
				<b-button variant="primary" @click="createTest()">
					Iniciar examen
				</b-button>
			</div>
		</article>
	</section>
</template>
<script>
export default {
	name: 'WelcomeIntro',
	created () {
		this.$emit('can-continue', { value: true })
	},
	mounted () {
		setTimeout(() => {
			const successLottie = require('@/assets/lotties/welcome_intro.json')
			this.$refs['welcome-intro'].load(successLottie)
			this.$emit('can-continue', { value: true })
		}, 300)
	},
	methods: {
		createTest () {
			this.loading = true
			let token = ''
			if (process.client) {
				token = localStorage.getItem('usertoken')
			}
			const headers = { Authorization: `Bearer ${token}` }
			this.$axios
				.post('/students/diagnostic', { first: true }, { headers })
				.then((response) => {
					console.log('Response:', response)
					this.$router.push({ path: '/diagnostic_test' })
				})
				.catch((err) => {
					console.log('Error:', err)
					this.test_error = true
				})
		}
	}
}
</script>
<style lang="scss" scoped>
	section {
		justify-content: space-evenly;
		background-color: #ffffff;
	}
	article {
		> * {
			width: 500px;
			height: 100%;
		}
		p {
			font-size: 16px;
		}
		.welcome-intro {
			width: 680px;
			text-align: center;
			lottie-player {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
	.body-xxxlg {
		font-weight: 800 !important;
	}
</style>
