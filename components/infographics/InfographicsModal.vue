<template>
	<b-modal
		id="infographic-modal"
		ref="infographic-modal"
		v-if="selectedInfographic"
		:title="selectedInfographic.title"
		header-text-variant="light"
		size="lg"
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
	name: 'InfographicsModal',
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
         this.$refs['infographic-modal'].hide()
         this.$emit('onMarkAsLearned', this.infographicIdx)
		}
   }
}
</script>
<style lang="scss">
	#infographic-modal {
		text-align: center;
		.modal-content {
			border: none;
			background-color: transparent;
			> * {
				border: none;
				padding: 0
			}
		}
		img {
			height: 60vh;
			object-fit: contain;
			object-position: center;
		}
		h5 {
			margin: auto;
			position: absolute;
			left: 2vw;
			right: 2vw;
		}
		.holdable-button {
			background-color: #ffffff;
			width: 260px;
		}
	}
</style>
