<template>
	<div id="infographics" class="p-2">
		<!--  EXTRA CONTENT (LEFT) -->
		<section class="manuals-container">
			<article class="shadow-sm full m-2 mb-3 p-3">
				<infographics-topics
					@onTopicChange="selectTopic"
					@onSubtopicChange="selectSubtopic"
				/>
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
						v-if="loadingState === false && selectedTopicId !== undefined"
						:topicId="selectedTopicId"
						:subtopicId="selectedSubtopicId"
						:infographicCardSize="infographicCardSize"
						@onSelectedInfographic="selectInfographic"
					/>
					<div class="text-center py-5" v-else>
						- Necesitas seleccionar un tema y subtema -
					</div>
				</template>
			</article>
		</section>
		<!--------------------------------------------------------------------------- Infographic Modal -->
		<infographics-carousel-modal
			:selectedInfographicIdx="selectedInfographicIdx"
			@onMarkAsLearned="markAsLearned"
		/>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import InfographicsTopics from '@/components/infographics/InfographicsTopics.vue'
import InfographicsHeader from '@/components/infographics/InfographicsHeader.vue'
import InfographicsGrid from '@/components/infographics/InfographicsGrid.vue'
import InfographicsCarouselModal from '@/components/infographics/InfographicsCarouselModal.vue'
export default {
	components: {
		LoadingState,
		InfographicsTopics,
		InfographicsHeader,
		InfographicsGrid,
		InfographicsCarouselModal
	},
	layout: 'new_default',
	data () {
		return {
			selectedTopicId: undefined,
			selectedSubtopicId: undefined,
			selectedInfographicIdx: 0,
			infographicCardSize: 300
		}
	},
	computed: {
		...mapState({
			onHttpRequest: state => state.http_request.onHttpRequest,
			message: state => state.http_request.message,
			errorHttp: state => state.http_request.errorHttp
		}),
		...mapGetters({
			loadingState: 'infographics/loadingState',
			allInfographics: 'infographics/allInfographics'
		})
	},
	methods: {
		selectTopic (topicId) {
			this.selectedTopicId = topicId
			this.selectedSubtopicId = undefined
		},
		selectSubtopic (subtopicId) {
			this.selectedSubtopicId = subtopicId
		},
		selectInfographic (selectedInfographicIdx) {
			this.selectedInfographicIdx = selectedInfographicIdx
			this.$bvModal.show('infographics-carousel-modal')
		},
		changeInfographicCardSize (infographicCardSize) {
			this.infographicCardSize = infographicCardSize
		},
		markAsLearned (selectedInfographicIdx) {
			this.selectedInfographicIdx = selectedInfographicIdx
			// const selectedInfographic = this.allInfographics[selectedInfographicIdx]
			// const infographics = this.allInfographics.splice(selectedInfographicIdx, 1)
			// const infographics = this.allInfographics
			// this.allInfographics.push(selectedInfographic)
			// this.$store.commit('infographics/setInfographics', this.allInfographics)
		}
	},
	mounted () {
		if (this.infographics === undefined) {
			this.$store.dispatch('infographics/fetchInfographics')
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
		.shadow-sm {
			background-color: #ffffff;
			overflow-y: auto;
			&.full {
				height: calc(100% - 2rem) !important
			}
		}
	}
</style>
