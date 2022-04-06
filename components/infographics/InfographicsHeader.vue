<template>
	<div class="infographics-header">
		<div />
		<h3 class="body-title-1 text-center mb-4">SpotlightMed Infographics</h3>
		<div>
			<b-icon icon="dash" class="h4 m-2 pointer" @click="changeInfographicCardSize(-1)" />
			<b-icon icon="plus" class="h4 m-2 pointer" @click="changeInfographicCardSize(1)" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'InfographicsHeader',
	props: {
		infographicCardSize: {
			type: Number,
			default: 0
		}
	},
	methods: {
		changeInfographicCardSize (change) {
			const scale = 100
			const infographicCardSize = +parseFloat(change * scale + this.infographicCardSize).toFixed(1)
			if (infographicCardSize >= 100 && infographicCardSize <= 500) {
				this.$emit('onChangeInfographicCardSize', infographicCardSize)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.infographics-header {
		display: grid;
		grid-template-columns: 1fr 10fr 1fr;
	}
</style>
