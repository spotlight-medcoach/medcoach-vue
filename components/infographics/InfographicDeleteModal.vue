<template>
	<div>
		<b-modal
			id="infographic-delete-modal"
			ref="infographic-delete-modal"
			title="Eliminar Infografía"
			cancel-title="Cancelar"
			ok-title="Sí, eliminar"
			ok-variant="danger"
			cancel-variant="light"
			header-class="pl-4"
			body-class="px-4"
			footer-class="d-flex justify-content-between"
			size="sm"
			centered
		>
			<template #modal-header-close>
				<b-icon icon="x" color="red" font-scale="1.1"></b-icon>
			</template>
			<p>
				Estás por eliminar la infografía
				<q>{{selectedInfographic.title}}</q>
			</p>
		</b-modal>
	</div>
</template>

<script>
import { infographics } from '@/components/infographics/template'
export default {
	name: 'InfographicsDeleteModal',
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
		deleteInfographic () {
			this.$emit('onDelete', this.infographicIdx)
			this.$refs['infographic-delete-modal'].hide()
		}
	}
}
</script>
