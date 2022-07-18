<template>
	<div id="analysis">
		<!--  EXTRA CONTENT (LEFT) -->
		<div class="shadow-sm m-3">
			<b-nav align="center">
				<b-nav-item class="body-lg py-1 px-4" :to="{ hash: 'studytime' }" active>Mi estudio</b-nav-item>
				<b-nav-item class="body-lg py-1 px-4" :to="{ hash: 'performance' }">Mi desempeño</b-nav-item>
				<b-nav-item class="body-lg py-1 px-4" :to="{ hash: 'community' }">Comunidad</b-nav-item>
			</b-nav>
		</div>
		<div class="shadow-sm m-3">
			<!---------------------------------------------------------------- Comunidad -->
			<section
				v-if="$route.hash === '#community'"
				id="community"
				class="p-5"
			>
				<template v-if="studyTime">
					<analysis-medscore id="my-medscore" />
					<analysis-medscore-global id="global-medscore" />
					<analysis-studytime-chart-global id="global-studytime" />
				</template>
			</section>
			<!---------------------------------------------------------------- Preguntas -->
			<section
				v-else-if="$route.hash === '#performance'"
				id="my-performance"
				class="px-0 pt-4 pb-3"
			>
				<analysis-answers-accuracy id="my-answers-accuracy" />
				<analysis-answers-category id="my-answers-category" />
				<analysis-tests-scores id="my-tests-scores" />
			</section>
			<!---------------------------------------------------------------- Mi estudio -->
			<section
				v-else
				id="my-study"
				class="p-5"
			>
				<analysis-studytime-chart id="my-studytime" />
				<analysis-general-progress id="my-general-progress" />
				<analysis-medscore id="my-medscore" />
				<analysis-summary id="my-summary" />
			</section>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import AnalysisStudytimeChart from '@/components/analysis/AnalysisStudytimeChart.vue'
import AnalysisGeneralProgress from '@/components/analysis/AnalysisGeneralProgress.vue'
import AnalysisMedscore from '@/components/analysis/AnalysisMedscore.vue'
import AnalysisMedscoreGlobal from '@/components/analysis/AnalysisMedscoreGlobal.vue'
import AnalysisSummary from '@/components/analysis/AnalysisSummary.vue'
import AnalysisAnswersAccuracy from '@/components/analysis/AnalysisAnswersAccuracy.vue'
import AnalysisAnswersCategory from '@/components/analysis/AnalysisAnswersCategory.vue'
import AnalysisTestsScores from '@/components/analysis/AnalysisTestsScores.vue'
import AnalysisStudytimeChartGlobal from '@/components/analysis/AnalysisStudytimeChartGlobal.vue'
const { Settings } = require('luxon')
export default {
	components: {
		AnalysisStudytimeChart,
		AnalysisGeneralProgress,
		AnalysisMedscore,
		AnalysisMedscoreGlobal,
		AnalysisSummary,
		AnalysisAnswersAccuracy,
		AnalysisAnswersCategory,
		AnalysisTestsScores,
		AnalysisStudytimeChartGlobal
	},
	layout: 'new_default',
	computed: {
		...mapGetters({
			studyTime: 'studytime/studyTime',
			studentFlashcards: 'flashcards/flashcards',
			studentCustomTests: 'custom_test/history',
			studentStats: 'student_stats/studentStats',
			communityStats: 'community_stats/communityStats'
		})
	},
	mounted () {
		Settings.defaultLocale = navigator.language || navigator.userLanguage
		if (this.studyTime === null) {
			this.$store.dispatch('studytime/fetchStudyTime')
		}
		if (this.studentFlashcards === null) {
			this.$store.dispatch('flashcards/fetchFlashcards')
		}
		if (this.studentCustomTests === null) {
			this.$store.dispatch('custom_test/fetchHistory')
		}
		if (this.studentStats === null) {
			this.$store.dispatch('student_stats/fetchStudentStats')
		}
		if (this.communityStats === null) {
			this.$store.dispatch('community_stats/fetchCommunityStats')
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/_student_main.scss';
	section {
		min-height: calc(#{$student-main-content-height} - 80px - 1rem);
		&#my-study {
			display: grid;
			grid-template-areas: "studytime medscore" "progress summary";
			gap: 2vmax;
			grid-template-columns: 2fr 1fr;
			#my-studytime {
				grid-area: studytime;
			}
			#my-general-progress {
				grid-area: progress;
			}
			#my-medscore {
				grid-area: medscore;
			}
			#my-summary {
				grid-area: summary;
			}
		}
		&#my-performance {
			display: grid;
			grid-template-areas:
				"accuracy accuracy category"
				"scores scores scores";
			gap: 1rem;
			#my-answers-accuracy {
				grid-area: accuracy;
			}
			#my-answers-category {
				grid-area: category;
			}
			#my-tests-scores {
				grid-area: scores;
			}
		}
		&#community {
			display: grid;
			grid-template-areas:
				"mymedscore medscore"
				"studytime studytime";
			gap: 2vmax;
			#my-medscore {
				grid-area: mymedscore;
				justify-self: center;
			}
			#global-medscore {
				grid-area: medscore;
				justify-self: start;
			}
			#global-studytime {
				grid-area: studytime;
				width: 100%;
			}
		}
	}
	.shadow-sm {
		background-color: #ffffff;
	}
</style>
