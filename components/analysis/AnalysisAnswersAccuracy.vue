<template>
	<article class="d-flex flex-row justify-content-between align-items-center">
		<div class="analysis-column">
			<div
				class="chart-container mb-3"
				:set="percentage=calculePercentage(studentStats.total_correct_questions, studentStats.total_wrong_questions)"
			>
				<div class="doughnut-chart w-100 w-100">
					<doughnut-chart
						:chart-data="{
							labels: ['Pendientes','Estudiados'],
							datasets: [{
								data: [studentStats.total_correct_questions, studentStats.total_wrong_questions],
								backgroundColor: ['#FFB63F', '#FF574F']
							}]
						}"
						:options="chartOptions"
					/>
				</div>
				<div class="caption-progress body-xxlg">{{ percentage[1] }} %</div>
			</div>
			<div
				class="chart-container mb-3"
				:set="percentage=calculePercentage(studentStats.total, studentStats.total_used_questions)"
			>
				<div class="doughnut-chart w-100 w-100">
					<doughnut-chart
						:chart-data="{
							labels: ['Pendientes','Estudiados'],
							datasets: [{
								data: [5, 95],
								backgroundColor: ['#FFB63F', '#BBBBB3']
							}]
						}"
						:options="chartOptions"
					/>
				</div>
				<div class="caption-progress body-xxlg">{{ percentage[0] }} %</div>
			</div>
		</div>
		<div class="analysis-column">
			<div class="table-container mt-2" :set="data=questionsScore()">
				<b-table-lite :borderless="true" :small="true" :items="data.items" :fields="data.fields" />
			</div>
			<div class="table-container mt-2" :set="data=questionsDataset()">
				<b-table-lite :borderless="true" :small="true" :items="data.items" :fields="data.fields" />
			</div>
		</div>
		<div class="analysis-column">
			<div class="table-container mt-2" :set="data=incertitudeAnswers()">
				<b-table-lite :borderless="true" :small="true" :items="data.items" :fields="data.fields" />
			</div>
			<div class="table-container mt-2" :set="data=testsStats()">
				<b-table-lite :borderless="true" :small="true" :items="data.items" :fields="data.fields" />
			</div>
		</div>
	</article>
</template>
<script>
// import { mapState } from 'vuex'
import DoughnutChart from '@/components/_functional/DoughnutChart.vue'
const defaultFields = [
	{
		key: 'approach',
		label: '',
		thClass: 'body-title-2 pb-3',
		tdClass: 'body-medium-3 text-left'
	},
	{
		key: 'results',
		label: '',
		thClass: 'body-title-2 pb-3',
		tdClass: 'body-title-3 text-right'
	}
]
export default {
	components: {
		DoughnutChart
	},
	data: () => ({
		studentStats: {
			total_correct_questions: 152,
			total_wrong_questions: 48,
			total_used_questions: 200,
			change_correct_to_incorrect: 0,
			change_incorrect_to_correct: 0,
			change_incorrect_to_incorrect: 0,
			// total_diagnostic_questions: { type: Number, default: 0 },
			// total_prognosis_questions: { type: Number, default: 0 },
			total: 3971
		},
		chartOptions: {
			legend: { display: false },
			cutoutPercentage: 82,
			tooltips: {
				enabled: false
			}
		},
		placeholderText: '...',
		questionsScore: () => {
			const fields = structuredClone(defaultFields) // deepCopy
			fields[0].label = 'Tu puntaje'
			return {
				fields,
				items: [
					{
						approach: 'Total de correctas',
						results: 152
					},
					{
						approach: 'Total incorrectas',
						results: 48
					}
				]
			}
		},
		questionsDataset: () => {
			const fields = structuredClone(defaultFields)
			fields[0].label = 'Uso del banco'
			return {
				fields,
				items: [
					{
						approach: 'Preguntas utilizadas',
						results: 200
					},
					{
						approach: 'Preguntas sin utilizar',
						results: 3771
					},
					{
						approach: 'Total de preguntas',
						results: 3971
					}
				]
			}
		},
		incertitudeAnswers: () => {
			const fields = structuredClone(defaultFields)
			fields[0].label = 'Cambio de preguntas'
			return {
				fields,
				items: [
					{
						approach: 'Correcta a incorrecta',
						results: 0
					},
					{
						approach: 'Incorrecta a correcta',
						results: 0
					},
					{
						approach: 'Incorrecta a incorrecta',
						results: 0
					}
				]
			}
		},
		testsStats: () => {
			const fields = structuredClone(defaultFields)
			fields[0].label = 'Número de exámenes'
			return {
				fields,
				items: [
					{
						approach: 'Exámenes creados',
						results: 24
					},
					{
						approach: 'Exámenes completados',
						results: 23
					},
					{
						approach: 'Exámenes suspendidos',
						results: 1
					}
				]
			}
		}
	}),
	computed: {
	},
	mounted () {
	},
	methods: {
		calculePercentage (totalValue, actualValue) {
			if (totalValue !== 0 && actualValue !== 0) {
				const learned = +parseFloat(actualValue / totalValue * 100).toFixed(2)
				const pending = 100 - learned
				return [learned, pending]
			}
			return [0, 100]
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	article {
		position: relative;
		.chart-container {
			position: relative;
			width: 168px;
			height: 168px;
			.caption-progress {
				position: absolute;
				margin: auto;
				height: fit-content;
				width: fit-content;
				top: 0px;
				left: 0;
				right: 0;
				bottom: 0;
			}
		}
		.analysis-column {
			> .table-container {
				min-height: 168px;
				width: 330px;
			}
		}
		::v-deep {
			td {
				border-bottom: 1px solid $neutral-400 !important;
			}
		}
	}
</style>
