<template>
	<b-modal
		id="infographics-carousel-modal"
		ref="infographics-carousel-modal"
		v-if="selectedInfographic"
		:title="selectedInfographic.title"
		header-close-label="x"
		size="lg"
		header-class="p-0"
		title-class="w-100 pl-5"
		body-class="p-0"
		footer-class="p-0"
		header-text-variant="light"
		v-b-modal.infographics-delete-modal
		centered
	>
		<div slot="modal-header-close">
			<b-icon icon="x" font-scale="2"></b-icon>
		</div>
		<b-carousel
			id="carousel-1"
			v-model="infographicIdx"
			:interval="3000"
			controls
		>
			<b-carousel-slide
				v-for="(infographic, index) in infographics"
				:key="index"
				:img-src="infographic.image"
			></b-carousel-slide>
		</b-carousel>
		<div slot="modal-footer" class="mx-auto mt-4">
			<holdable-button
				class="rounded p-2"
				message="Marcar como aprendido"
				:maxWidth="300"
				@onCheck="markAsLearned"
			>
			</holdable-button>
		</div>
	</b-modal>
</template>

<script>
import { infographics } from '@/components/infographics/template'
import HoldableButton from '@/components/_functional/holdableButton.vue'
export default {
	name: 'InfographicsCarouselModal',
	components: {
		HoldableButton
	},
	props: {
		selectedInfographicIdx: {
			type: Number,
			default: 0
		}
	},
	watch: {
		selectedInfographicIdx () {
			this.infographicIdx = this.selectedInfographicIdx
		}
	},
	data () {
		return {
			infographicIdx: 0
		}
	},
	computed: {
		infographics () {
			return infographics
		},
		selectedInfographic () {
			return infographics[this.infographicIdx]
		}
	},
	methods: {
		markAsLearned () {
			this.$refs['infographics-carousel-modal'].hide()
			this.$emit('onMarkAsLearned', this.infographicIdx)
		}
	}
}
</script>
<style lang="scss">
	#infographics-carousel-modal {
		text-align: center;
		.modal-content {
			background-color: transparent;
		}
		img {
			height: 60vh;
			object-fit: contain;
			object-position: center;
		}
		.holdable-button {
			background-color: #ffffff;
			width: 260px;
		}
	}
</style>
