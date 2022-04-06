<template>
	<div id="infographics" class="p-2">
		<!-- MAIN CONTENT (RIGHT) -->
		<section class="infographics-container">
			<article class="shadow-sm full m-2 mb-3 p-5">
				<template v-if="onHttpRequest">
					<loading-state message="Estamos obteniendo tus resultados" />
				</template>
				<div v-else-if="errorHttp">
					<p>{{ message }}</p>
				</div>
				<template v-else>
					<!-------------------------------------------------------------------- Infographics Header -->
					<infographics-admin-header class="pb-4"/>
					<!-------------------------------------------------------------------- Infographics Content -->
					<manage-infographics-grid
						:infographicCardSize="infographicCardSize"
						:overlayIcon="'trash-fill'"
						@onSelectedInfographic="selectInfographic"
					/>
				</template>
			</article>
		</section>
		<!--------------------------------------------------------------------------- Infographic Modal -->
		<template v-if="!onHttpRequest && message">
			<infographic-create-modal />
			<infographic-delete-modal
				:selectedInfographicIdx="selectedInfographicIdx"
			/>
		</template>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import InfographicsAdminHeader from '@/components/infographics/InfographicsAdminHeader.vue'
import ManageInfographicsGrid from '@/components/infographics/ManageInfographicsGrid.vue'
import InfographicCreateModal from '@/components/infographics/InfographicCreateModal.vue'
import InfographicDeleteModal from '@/components/infographics/InfographicDeleteModal.vue'
export default {
	components: {
		LoadingState,
		InfographicsAdminHeader,
		ManageInfographicsGrid,
		InfographicCreateModal,
		InfographicDeleteModal
	},
	layout: 'new_default',
	data () {
		return {
			selectedTopicIdx: 0,
			selectedSubtopicIdx: 0,
			selectedInfographicIdx: 0,
			infographicCardSize: 300
		}
	},
	computed: {
		...mapState({
			onHttpRequest: state => state.http_request.onHttpRequest,
			message: state => state.http_request.message,
			errorHttp: state => state.http_request.errorHttp
		})
	},
	methods: {
		createInfographic () {
			this.$bvModal.show('infographic-create-modal')
		},
		selectInfographic (selectedInfographicIdx) {
			this.selectedInfographicIdx = selectedInfographicIdx
			this.$bvModal.show('infographic-delete-modal')
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/_student_main.scss';
	#infographics {
		.shadow-sm {
			background-color: #ffffff;
			overflow-y: auto;
		}
	}
</style>
