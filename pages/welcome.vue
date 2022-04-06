<template>
	<div id="dashboard">
		<!-- <horizontal-stepper
			:steps="steps"
			@completed-step="completeStep"
			@active-step="isStepActive"
		/> -->
		<welcome-intro />
	</div>
</template>
<script>
// import HorizontalStepper from '@/components/welcome/HorizontalStepper/HorizontalStepper'
import WelcomeIntro from '@/components/welcome/WelcomeIntro.vue'
// import DiagnosticTest from '@/components/welcome/DiagnosticTest'
export default {
	name: 'Welcome',
	components: {
		WelcomeIntro
	},
	layout: 'new_default',
	created () {
		const token = this.$route.query.token
		if (token !== undefined) {
			if (process.client) {
				this.$store.commit('setToken', token)
				this.$store.commit('setBearer')
				localStorage.setItem('usertoken', token)
			}
		} else {
			alert('No tiene token será redireccionado')
			this.$router.push({ path: '/' })
		}
	},
	mounted () {
		this.$store.commit('sidebar/setSidebarActive', false)
		this.$store.commit('sidebar/setNavigationEnabled', false)
	},
	methods: {
		increaseStepIdx () {

		},
		completeStep (payload) {
			this.steps.forEach((step) => {
				if (step.name === payload.name) {
					step.completed = true
				}
			})
		},
		isStepActive (payload) {
			this.steps.forEach((step) => {
				if (step.name === payload.name) {
					if (step.completed === true) {
						step.completed = false
					}
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
