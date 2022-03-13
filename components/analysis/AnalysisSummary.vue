<template>
	<article>
		<div class="table-container">
			<b-table
				:borderless="true"
				:small="true"
				:items="summary"
				:fields="fields"
				class="mx-auto"
			/>
		</div>
	</article>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
	components: {
	},
	data: () => ({
		placeholderText: '...',
		fields: [
			{
				key: 'approach',
				label: '',
				tdClass: 'body-title-3'
			},
			{
				key: 'results',
				label: 'Total',
				thClass: 'heading-6 text-center pb-3',
				tdClass: 'body-title-3'
			}
		]
	}),
	computed: {
		summary () {
			return [
				{
					approach: 'Horas de estudio',
					results: this.studyTime ? `${Math.round(this.studyTime.study_minutes / 60 * 100) / 100} hrs` : this.placeholderText
				},
				{
					approach: 'Manuales',
					results: this.totalProgress && this.totalManuals ? `${this.totalProgress} / ${this.totalManuals}` : this.placeholderText
				},
				{
					approach: 'Notas',
					results: this.totalProgress ? `${this.totalProgress}` : this.placeholderText
				},
				{
					approach: 'Infográficos',
					results: this.studentInfographics ? `${this.studentInfographics.length}` : this.placeholderText
				},
				{
					approach: 'Flashcards',
					results: this.studentFlashcards ? `${this.studentFlashcards.length}` : this.placeholderText
				},
				{
					approach: 'Preguntas',
					results: this.studentCustomTests ? `${this.studentCustomTests.length}` : this.placeholderText
				},
				{
					approach: 'Exámenes',
					results: this.studentCustomTests ? `${this.studentCustomTests.length}` : this.placeholderText
				}
			]
		},
		...mapGetters({
			studyTime: 'studytime/studyTime',
			studentInfographics: 'infographics/studentInfographics',
			studentFlashcards: 'flashcards/flashcards',
			studentCustomTests: 'custom_test/history'
		}),
		...mapState({
			totalProgress: state => state.topics.data.reduce((acc, curr) => acc + curr.progress, 0),
			totalManuals: state => state.topics.data.reduce((acc, curr) => acc + curr.total, 0)
		})
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	article {
		table {
			max-width: 400px;
		}
		::v-deep.body-title-2 {
			font-weight: 900 !important;
		}
	}
</style>
