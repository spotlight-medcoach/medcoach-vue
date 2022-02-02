<template>
	<div class="d-flex flex-wrap justify-content-around">
		<div
			v-for="(infographic, index) in infographics"
			v-b-modal.infographic-modal
			:key="index"
			class="infographic-item p-4"
			@click="selectedInfographic(index)"
		>
			<div class="font-weight-utra-bolder">
				{{infographic.title}}
			</div>
			<img
				:src="infographic.image"
				:style="{'width': infographicCardSize+'px', 'height': infographicCardSize+'px'}"
				:alt="infographic.title"
			>
		</div>
	</div>
</template>

<script>
import { infographics } from '@/components/infographics/template'
export default {
	name: 'InfographicsGrid',
	props: {
		infographicCardSize: {
			type: Number,
			default: 0
		}
	},
	computed: {
		infographics () {
			return infographics
		}
	},
	methods: {
		selectedInfographic (infographicIdx) {
			this.$emit('onSelectedInfographic', infographicIdx)
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	.infographic-item {
		color: #{$main-500};
		img {
			object-fit: cover;
			object-position: center;
			width: 100%;
			transition: all 0.6s;
		}
	}
</style>
