<template>
	<article>
		<div class="controls">
			<span class="score body-title-3 ml-5">Calificación por exámenes</span>
			<span class="pending body-title-3 ml-5">Exámen pendiente</span>
		</div>
		<div class="bar-chart">
			<bar-chart
				:chart-data="{
					labels: customTestsContent.labels,
					datasets: [{
						label: 'Calificación por exámenes',
						data: customTestsContent.data,
						backgroundColor: customTestsContent.background,
						borderWidth: 0
					}]
				}"
				:options="chartOptions"
			/>
		</div>
	</article>
</template>
<script>
import { mapGetters } from 'vuex'
import BarChart from '@/components/_functional/BarChart.vue'
const { DateTime } = require('luxon')
export default {
	components: {
		BarChart
	},
	data: () => ({
		minChartBarColumns: 34,
		chartOptions: {
			responsive: true,
			maintainAspectRatio: false,
			legend: { display: false },
			scales: {
				yAxes: [{
					ticks: {
						max: 100,
						stepSize: 25,
						fontColor: '#1d1d1b66',
						fontFamily: "'Avenir', sans-serif",
						fontSize: 12
					}
				}],
				xAxes: [{
					ticks: {
						min: 20,
						fontColor: '#000000',
						fontFamily: "'Avenir', sans-serif",
						fontSize: 12,
						maxRotation: 0,
						minRotation: 0
					},
					gridLines: {
						display: false
					}
				}],
				dataset: [{
					maxBarThickness: 24
				}]
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
						console.log(tooltipItems.yLabel === -25)
						return tooltipItems.yLabel === -25 ? 'Pendiente' : 'Calificación: ' + tooltipItems.yLabel
					}
				}
			},
			layout: {
				padding: {
					top: 40
				}
			}
		}
	}),
	computed: {
		customTestsContent () {
			const blank = { labels: [], background: [], data: [] }
			if (this.studentCustomTests) {
				const studentCustomTests = structuredClone(this.studentCustomTests)
					.sort((a, b) => {
						const keyA = DateTime.fromFormat(a.date, 'DDD', { locale: 'es' })
						const keyB = DateTime.fromFormat(b.date, 'DDD', { locale: 'es' })
						return (keyA < keyB) ? -1 : 1
					}).reduce((acc, customTests) => {
						const ISODate = DateTime.fromFormat(customTests.date, 'DDD', { locale: 'es' }).toFormat('dd/MM')
						const cleanScoreString = customTests.score.replace(/[^\d.]/g, '')
						const score = cleanScoreString ? +parseFloat(cleanScoreString).toFixed(2) : 0
						const background = customTests.finished ? '#FF930080' : '#BBBBB380'
						acc.labels.push(customTests.finished ? `${ISODate}` : `• ${ISODate}`)
						acc.background.push(background)
						acc.data.push(score)
						return acc
					}, blank)
				if (this.studentCustomTests.length < this.minChartBarColumns) {
					const nEmptyCols = this.minChartBarColumns - this.studentCustomTests.length
					const valEmptyCols = Array.from({ length: nEmptyCols }, (_, i) => '')
					studentCustomTests.labels.push(...valEmptyCols)
					studentCustomTests.background.push(...valEmptyCols)
					studentCustomTests.data.push(...valEmptyCols)
				}
				return studentCustomTests
			}
			return blank
		},
		...mapGetters({
			studentCustomTests: 'custom_test/history'
		})
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	article {
		.bar-chart, .bar-chart > * {
			height: 260px !important;
		}
	}
	.controls {
		> * {
			position: relative;
		}
		> .pending::before {
			content: '•';
			position: absolute;
			left: -20px;
		}
		> .score::before {
			content: '';
			width: 20px;
			height: 20px;
			position: absolute;
			left: -30px;
			background-color: #FF930080;
		}
	}
</style>
