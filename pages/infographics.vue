<template>
	<div id="infographics" class="p-2">
		<!--  EXTRA CONTENT (LEFT) -->
		<section class="manuals-container">
			<article class="shadow-sm full m-2 mb-3 p-3">
				<infographics-topics />
			</article>
		</section>
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
					<infographics-header
						:infographicCardSize="infographicCardSize"
						@onChangeInfographicCardSize="changeInfographicCardSize"
					/>
					<!-------------------------------------------------------------------- Infographics Content -->
					<infographics-grid
						:infographicCardSize="infographicCardSize"
						@onSelectedInfographic="selectInfographic"
					/>
				</template>
			</article>
		</section>
		<!--------------------------------------------------------------------------- Infographic Modal -->
		<infographics-modal
			:selectedInfographicIdx="selectedInfographicIdx"
			@onMarkAsLearned="markAsLearned"
		/>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import InfographicsTopics from '@/components/infographics/InfographicsTopics.vue'
import InfographicsHeader from '@/components/infographics/InfographicsHeader.vue'
import InfographicsGrid from '@/components/infographics/InfographicsGrid.vue'
import InfographicsModal from '@/components/infographics/InfographicsModal.vue'
export default {
	components: {
		LoadingState,
		InfographicsTopics,
		InfographicsHeader,
		InfographicsGrid,
		InfographicsModal
	},
	layout: 'new_default',
	data () {
		return {
			loadStatus: undefined,
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
		selectInfographic (selectedInfographicIdx) {
			this.selectedInfographicIdx = selectedInfographicIdx
		},
		changeInfographicCardSize (infographicCardSize) {
			this.infographicCardSize = infographicCardSize
		},
		markAsLearned (selectedInfographicIdx) {
			this.selectedInfographicIdx = selectedInfographicIdx
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/_student_main.scss';
	#infographics {
		display: grid;
		grid-template-columns: minmax(320px, auto) 3fr;
		overflow-y: hidden;
		section {
			height: $student-main-content-height;
		}
		article.shadow-sm {
			background-color: #fff;
			overflow-y: auto;
			&.full {
				height: calc(100% - 2rem) !important
			}
		}
	}
</style>
