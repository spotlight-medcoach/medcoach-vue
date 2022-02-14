<template>
	<section id="custom-test-mode" class="custom-card d-flex">
		<div id="exam-mode">
			<p class="body-title-1 mb-20px text-nowrap">Modo de examen</p>
			<toggle-switch
				v-model="settings.time"
				label="Tiempo"
				class="justify-content-center"
			/>
		</div>
		<div id="question-mode">
			<div class="body-title-1 mb-20px">Modo de preguntas</div>
			<div class="d-flex justify-content-between">
				<toggle-switch-radio v-model="settings.mode" label="Sin contestar" name="type" valor="not_answered"/>
				<toggle-switch-radio v-model="settings.mode" label="Contestados" name="type" valor="answered"/>
				<toggle-switch-radio v-model="settings.mode" label="Equivocados" name="type" valor="wrong"/>
				<toggle-switch-radio v-model="settings.mode" label="Todos" name="type" valor="all"/>
			</div>
		</div>
	</section>
</template>
<script>
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import ToggleSwitchRadio from '@/components/ToggleSwitchRadio.vue'

export default {
	props: {
		settings: {
			type: Object,
			required: true
		}
	},
	components: {
		ToggleSwitchRadio,
		ToggleSwitch
	}
}
</script>
<style lang="scss">
	#custom-test-mode {
		padding: 26.5px 24px;
		#exam-mode {
			border-right: thin solid;
			width: auto;
			padding-right: 40px;
			margin-right: 40px;
		}
		#question-mode {
			width: 75%;
		}
	}
</style>
