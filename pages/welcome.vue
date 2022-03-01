<template>
	<div id="dashboard">
		<welcome-intro />
	</div>
</template>
<script>
// import HorizontalStepper from '@/components/welcome/HorizontalStepper/HorizontalStepper'
// import Welcome from '@/components/welcome/Welcome'
// import WelcomeIntro from '@/components/welcome/WelcomeIntro'
import WelcomeIntro from '~/components/welcome/WelcomeIntro.vue'
// import DiagnosticTest from '@/components/welcome/DiagnosticTest'
export default {
	name: 'Welcome',
	components: {
		WelcomeIntro
		// HorizontalStepper
	},
	layout: 'new_default',
	// data () {
	// 	return {
	// 		steps: [
	// 			{
	// 				icon: '',
	// 				name: 'first',
	// 				title: 'Bienvenida',
	// 				component: Welcome,
	// 				completed: true,
	// 				alwaysActive: true

	// 			},
	// 			{
	// 				icon: '',
	// 				name: 'third',
	// 				title: 'Diagnóstico',
	// 				component: DiagnosticTest,
	// 				completed: true,
	// 				alwaysActive: true
	// 			}
	// 		],
	// 		plan_selected: null
	// 	}
	// },
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
