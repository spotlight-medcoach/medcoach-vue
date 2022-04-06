<template>
	<article>
		<h2 class="body-title-2">Mi estudio total</h2>
		<div class="controls d-flex justify-content-between">
			<h3 class="body-title-3 my-3">Horas estudiadas</h3>
			<b-dropdown size="sm" variant="white" no-caret>
				<template #button-content>
					<span class="body-title-3 mr-2">{{ selectedScope }}</span>
					<b-icon icon="chevron-down" />
				</template>
				<b-dropdown-header id="dropdown-header-label"> Ver métricos por </b-dropdown-header>
				<template v-for="scope in chartScopes">
					<b-dropdown-item-button :key="scope" @click="selectedScope=scope">
						<b-icon :icon="selectedScope === scope ? 'check' : 'blank'" aria-hidden="true" />
						{{ scope }}
					</b-dropdown-item-button>
				</template>
			</b-dropdown>
		</div>
		<div class="chart-container" >
			<div class="line-chart" :class="{'chart-active': selectedScope === 'Semana'}">
				<line-chart
					v-if="chartWeek.datasets.length"
					:chartdata="chartWeek"
					:options="options"
					class="w-100 h-100"
				/>
			</div>
			<div class="line-chart" :class="{'chart-active': selectedScope === 'Mes'}">
				<line-chart
					v-if="chartMonth.datasets.length"
					:chartdata="chartMonth"
					:options="options"
					class="w-100 h-100"
				/>
			</div>
		</div>
	</article>
</template>
<script>
import { mapGetters } from 'vuex'
import { groupByWeek, groupByMonth, calculeWeekLabels, calculeWeekValues } from './analysisStudytimeChartCalculations.js'
import LineChart from '@/components/_functional/LineChart.vue'
const { DateTime } = require('luxon')
export default {
	components: {
		LineChart
	},
	data: () => ({
		today: DateTime.now(),
		chartScopes: ['Semana', 'Mes'],
		selectedScope: 'Semana',
		chartWeek:	{ labels: [], datasets: [] },
		chartMonth: { labels: [], datasets: [] },
		options: {
			maintainAspectRatio: false,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						maxTicksLimit: 5,
						fontColor: '#1d1d1b66',
						fontFamily: "'Avenir', sans-serif",
						fontSize: 12
					},
					gridLines: {
						display: false
					}
				}],
				xAxes: [{
					ticks: {
						beginAtZero: true,
						fontColor: '#000000',
						fontFamily: "'Avenir', sans-serif",
						fontSize: 17
					}
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
				callbacks: {
					title: () => {},
					label: tooltipItems => tooltipItems.yLabel + ' hrs'
				}
			}
		}
	}),
	computed: {
		...mapGetters({
			studyTime: 'studytime/studyTime'
		})
	},
	watch: {
		studyTime (studyTime) {
			this.calculeScopes(studyTime)
		}
	},
	created () {
		this.chartWeek.labels = this.chartMonth.labels = calculeWeekLabels()
	},
	mounted () {
		if (this.studyTime) {
			this.calculeScopes(this.studyTime)
		}
	},
	methods: {
		calculeScopes (studentStudyTimes) {
			this.chartByWeek(studentStudyTimes)
			this.chartByMonth(studentStudyTimes)
		},
		chartByWeek (studentStudyTimes) {
			const studyTimesByWeek = groupByWeek(studentStudyTimes.days)
			const currentWeekDataChart = calculeWeekValues(studyTimesByWeek[this.today.weekNumber])
			const bestWeekDataChart = calculeWeekValues(studyTimesByWeek.best)
			this.fillChart('chartWeek', currentWeekDataChart, bestWeekDataChart)
		},
		chartByMonth (studentStudyTimes) {
			const studyTimesByMonth = groupByMonth(studentStudyTimes.days)
			const currentMonthDataChart = calculeWeekValues(studyTimesByMonth[this.today.month])
			const bestMonthDataChart = calculeWeekValues(studyTimesByMonth.best)
			this.fillChart('chartMonth', currentMonthDataChart, bestMonthDataChart)
		},
		fillChart (scope, current, best) {
			this[scope].datasets = [
				{
					label: 'Current',
					data: current,
					borderWidth: 0,
					borderColor: '#ff930000',
					backgroundColor: '#ff930066',
					pointHoverBorderWidth: 0
				},
				{
					label: 'Best',
					data: best,
					borderWidth: 0,
					borderColor: '#71d1f800',
					backgroundColor: '#71d1f866',
					pointHoverBorderWidth: 0
				}
			]
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	article {
		.chart-container {
			position: relative;
			.line-chart {
				height: 200px;
				&:not(.chart-active) {
					position: absolute;
					opacity: 0;
				}
			}
		}
		h2 {
			font-weight: 900;
		}
	}
</style>
