<template>
	<article v-if="studentStats" class="d-flex flex-row justify-content-between align-items-center ml-5">

		<div class="analysis-column">
			<!----------------------------------------- Tu puntaje dougnut chart -->
			<div class="chart-container mb-3">
				<template v-if="studentStats">
					<div class="doughnut-chart">
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
					<div
						:set="percentage=calculePercentage(studentStats.total_correct_questions, studentStats.total_wrong_questions)"
						class="caption-progress body-xxlg"
					>
						{{ percentage[1] }} %
					</div>
				</template>
			</div>
			<!----------------------------------------- Uso del banco dougnut chart -->
			<div class="chart-container mb-3">
				<template v-if="studentStats">
					<div class="doughnut-chart">
						<doughnut-chart
							:chart-data="{
								labels: ['Utilizadas','Sin utilizar'],
								datasets: [{
									data: [studentStats.total_used_questions, studentStats.total - studentStats.total_used_questions],
									backgroundColor: ['#FFB63F', '#BBBBB3']
								}]
							}"
							:options="chartOptions"
						/>
					</div>
					<div
						:set="percentage=calculePercentage(studentStats.total, studentStats.total_used_questions)"
						class="caption-progress body-xxlg"
					>
						{{ percentage[0] }} %
					</div>
				</template>
			</div>
		</div>
		<div class="analysis-column">
			<!----------------------------------------- Tu puntaje scores -->
			<div class="table-container mt-2" :set="data=questionsScore">
				<b-table-lite :borderless="true" :small="true" :items="data.items" :fields="data.fields" />
			</div>
			<!----------------------------------------- Tu puntaje banco -->
			<div class="table-container mt-2" :set="data=questionsDataset">
				<b-table-lite :borderless="true" :small="true" :items="data.items" :fields="data.fields" />
			</div>
		</div>
		<div class="analysis-column">
			<!----------------------------------------- Cambio de preguntas scores -->
			<div class="table-container mt-2" :set="data=incertitudeAnswers">
				<b-table-lite :borderless="true" :small="true" :items="data.items" :fields="data.fields" />
			</div>
			<!----------------------------------------- Número de exámenes scores -->
			<div class="table-container mt-2" :set="data=testsStats">
				<b-table-lite :borderless="true" :small="true" :items="data.items" :fields="data.fields" />
			</div>
		</div>
	</article>
</template>
<script>
import { mapGetters } from 'vuex'
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
		chartOptions: {
			legend: { display: false },
			cutoutPercentage: 82,
			tooltips: {
				enabled: true,
				cornerRadius: 0,
				borderWidth: 1,
				borderColor: '#979797',
				backgroundColor: '#ffffff',
				bodyFontFamily: "'Avenir', sans-serif",
				bodyFontSize: 15,
				bodyFontColor: '#000000',
				xPadding: 24,
				yPadding: 8,
				yAlign: 'center',
				displayColors: false,
				callbacks: {
					title: () => {},
					label: (tooltipItem, data) => {
						const indice = tooltipItem.index
						const tag = data.datasets[0].data[indice] === 1 ? 'pregunta' : 'preguntas'
						return data.datasets[0].data[indice] + ' ' + tag
					}
				}
			}
		},
		placeholderText: 0
	}),
	computed: {
		questionsScore () {
			const fields = structuredClone(defaultFields) // deepCopy
			fields[0].label = 'Tu puntaje'
			return {
				fields,
				items: [
					{
						approach: 'Total de correctas',
						results: this.studentStats ? this.studentStats.total_correct_questions : this.placeholderText
					},
					{
						approach: 'Total incorrectas',
						results: this.studentStats ? this.studentStats.total_wrong_questions : this.placeholderText
					}
				]
			}
		},
		questionsDataset () {
			const fields = structuredClone(defaultFields)
			fields[0].label = 'Uso del banco'
			return {
				fields,
				items: [
					{
						approach: 'Preguntas utilizadas',
						results: this.studentStats ? this.studentStats.total_used_questions : this.placeholderText
					},
					{
						approach: 'Preguntas sin utilizar',
						results: this.studentStats ? (this.studentStats.total - this.studentStats.total_used_questions) : this.placeholderText
					},
					{
						approach: 'Total de preguntas',
						results: this.studentStats ? this.studentStats.total : this.placeholderText
					}
				]
			}
		},
		incertitudeAnswers () {
			const fields = structuredClone(defaultFields)
			fields[0].label = 'Cambio de preguntas'
			return {
				fields,
				items: [
					{
						approach: 'Correcta a incorrecta',
						results: this.studentStats ? this.studentStats.change_correct_to_incorrect : this.placeholderText
					},
					{
						approach: 'Incorrecta a correcta',
						results: this.studentStats ? this.studentStats.change_incorrect_to_correct : this.placeholderText
					},
					{
						approach: 'Incorrecta a incorrecta',
						results: this.studentStats ? this.studentStats.change_incorrect_to_incorrect : this.placeholderText
					}
				]
			}
		},
		testsStats () {
			const fields = structuredClone(defaultFields)
			fields[0].label = 'Número de exámenes'
			return {
				fields,
				items: [
					{
						approach: 'Exámenes creados',
						results: this.studentCustomTests ? this.studentCustomTests.length : this.placeholderText
					},
					{
						approach: 'Exámenes completados',
						results: this.finishedCustomTests ? this.finishedCustomTests : this.placeholderText
					},
					{
						approach: 'Exámenes suspendidos',
						results: this.discontinuedCustomTests ? this.discontinuedCustomTests : this.placeholderText
					}
				]
			}
		},
		finishedCustomTests () {
			if (this.studentCustomTests) {
				return this.studentCustomTests.reduce((prev, curr) => curr.finished ? prev + 1 : prev, 0)
			}
			return 0
		},
		discontinuedCustomTests () {
			if (this.studentCustomTests) {
				return this.studentCustomTests.reduce((prev, curr) => !curr.finished ? prev + 1 : prev, 0)
			}
			return 0
		},
		...mapGetters({
			studentStats: 'student_stats/studentStats',
			studentCustomTests: 'custom_test/history'
		})
	},
	methods: {
		calculePercentage (totalValue, actualValue) {
			if (totalValue !== 0 && actualValue !== 0) {
				const learned = +parseFloat(actualValue / totalValue * 100).toFixed(2)
				const pending = 100 - learned
				return [learned.toFixed(2), pending.toFixed(2)]
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
				min-width: 260px;
			}
		}
		::v-deep {
			td {
				border-bottom: 1px solid $neutral-400 !important;
			}
		}
	}
</style>
