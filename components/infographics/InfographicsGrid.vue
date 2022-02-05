<template>
	<div class="d-flex flex-wrap justify-content-around">
		<div
			v-for="(infographic, index) in infographics"
			:key="index"
			class="infographic-item p-4 pointer"
			@click="selectedInfographic(index)"
		>
			<div class="font-weight-utra-bolder">
				{{infographic.title}}
			</div>
			<div class="infographic-preview">
				<img
					:src="infographic.image"
					:style="{'width': infographicCardSize+'px', 'height': infographicCardSize+'px'}"
					:alt="infographic.title"
				>
				<div
					v-if="overlayIcon"
					class="overlay-content d-flex justify-content-center align-items-center"
				>
					<!-- <b-icon v-if="overlayIcon" icon="trash-fill" font-scale="2" color="white"></b-icon> -->
					<b-icon v-bind="createIcon" font-scale="2" color="white"></b-icon>
					<!-- <b-icon v-if="overlayIcon" v-bind="createIcon(overlayIcon)" font-scale='2' color='white'></b-icon> -->
				</div>
			</div>
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
		},
		overlayIcon: {
			type: String,
			default: undefined
		}
	},
	computed: {
		infographics () {
			return infographics
		},
		createIcon () {
			return {
				icon: this.overlayIcon
			}
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
		.infographic-preview {
			position: relative;
			img {
				object-fit: cover;
				object-position: center;
				width: 100%;
				transition: all 0.6s;
			}
			.overlay-content {
				position: absolute;
				background-color: rgba(#000000, 0.25);
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				z-index: -1;
				opacity: 0;
				transition: opacity 0.4s;
			}
			&:hover .overlay-content {
				z-index: 1;
				opacity: 1;
			}
		}
	}
</style>
