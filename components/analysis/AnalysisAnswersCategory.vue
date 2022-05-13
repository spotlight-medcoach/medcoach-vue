<template>
	<article ref="my-general-progress" class="d-flex flex-row justify-content-between align-items-center mr-5">
		<div class="radar-chart">
			<radar-chart
				:chart-data="{
					labels: [
						'Diagnóstico',
						'Ciencias básicas',
						'Prevención',
						'Pronóstico',
						'Tratamiento'
					],
					datasets: [{
						label: 'Categorías',
						data: answersCategoryData,
						fill: true,
						backgroundColor: 'rgba(0, 142, 255, 0.16597)',
						borderColor: '#008EFF',
						pointBackgroundColor: '#008EFF',
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor: '#008EFF'
					}]
				}"
				:options="chartOptions"
			/>
		</div>
	</article>
</template>
<script>
import { mapGetters } from 'vuex'
import RadarChart from '@/components/_functional/RadarChart.vue'
export default {
	components: {
		RadarChart
	},
	data: () => ({
		chartOptions: {
			responsive: true,
			maintainAspectRatio: true,
			legend: {
				display: false
			},
			elements: {
				line: {
					tension: 0.4,
					borderWidth: 1
				}
			},
			scale: {
				pointLabels: {
					fontColor: '#000000',
					fontFamily: "'Avenir', sans-serif",
					fontSize: 15,
					fontStyle: 'bold'
				}
			},
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
				yAlign: 'bottom',
				xAlign: 'center',
				displayColors: false,
				callbacks: {
					title: () => {},
					label: (tooltipItems) => {
						return tooltipItems.yLabel + ' preguntas'
					}
				}
			}
		}
	}),
	computed: {
		answersCategoryData () {
			return [
				this.studentStats ? this.studentStats.total_diagnostic_questions		: 0,
				this.studentStats ? this.studentStats.total_basic_sciences_questions	: 0,
				this.studentStats ? this.studentStats.total_prevention_questions		: 0,
				this.studentStats ? this.studentStats.total_prognosis_questions			: 0,
				this.studentStats ? this.studentStats.total_treatment_questions			: 0
			]
		},
		...mapGetters({
			studentStats: 'student_stats/studentStats'
		})
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	article {
		position: relative;
		.radar-chart {
			width: 100%;
			//margin-left: auto;
			//margin-top: -50px;
			//margin-bottom: -50px;
		}
	}
</style>
