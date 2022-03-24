<template>
	<section id="congrats" class="d-flex flex-column align-items-center justify-content-center">
		<article class="text-center">
			<div class="display-3 my-5">Bienvenid@ a tu experiencia</div>
			<img class="medcoach mb-2" src="@/assets/images/MedCOACH.png">
			<div class="heading-1 my-5">A conquistar el ENARM</div>
			<b-button class="mx-auto mt-5" variant="primary" @click="updateProfile()">Iniciar mi exámen Diagnóstico</b-button>
		</article>
		<div class="congrats-animation">
			<lottie-player
				ref="congrats-animation"
				class="congrats-animation"
				background="transparent"
				mode="normal"
				speed="1"
				loop
				autoplay
			/>
		</div>
	</section>
</template>
<script>
export default {
	layout: 'new_default',
	mounted () {
		setTimeout(() => {
			const successLottie = require('@/assets/lotties/congrats_success.json')
			this.$refs['congrats-animation'].load(successLottie)
		}, 300)
	},
	methods: {
		updateProfile () {
			this.$store.dispatch('initialize')
			const tokenUser = localStorage.getItem('usertoken')
			this.$router.push({ name: 'welcome', query: { token: tokenUser } })
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/_student_main.scss';
	#congrats {
		background: #fff;
		article {
			position: relative;
			z-index: 1;
		}
		img.medcoach {
			max-height: 97px;
			max-width: 427px;
		}
		.congrats-animation {
			height: 100%;
			width: auto;
			position: absolute;
			margin: auto;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 0;
			text-align: center;
			lottie-player {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
</style>
