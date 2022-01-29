<template>
	<b-icon
		:icon="brightnessIcon || 'brightness-high'"
		class="m-2 pointer"
		@click="changeBrightness()"
	/>
</template>
<script>
import brightnessStates from '@/assets/json/brightness.json'
export default {
	name: 'SwitchBrightnessButton',
	data () {
		return {
			brightnessState: 'light'
		}
	},
	computed: {
		brightnessIcon () {
			return brightnessStates[this.brightnessState].icon
		}
	},
	methods: {
		changeBrightness () {
			switch (this.brightnessState) {
				case 'light': {
					this.brightnessState = 'dark'
					break
				}
				case 'dark': {
					this.brightnessState = 'sepia'
					break
				}
				case 'sepia': {
					this.brightnessState = 'light'
					break
				}
			}
			const brightness = brightnessStates[this.brightnessState]
			this.$emit('onChangeBrightness', brightness)
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
</style>
