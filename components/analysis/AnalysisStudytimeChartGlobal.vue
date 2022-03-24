<template>
	<article>
		<div class="controls d-flex justify-content-between">
			<h3 class="body-title-2 my-3">Horas estudiadas</h3>
			<b-dropdown size="sm" variant="white" no-caret>
				<template #button-content>
					<span class="body-title-2 mr-2">{{ selectedScope.toFormat('MMMM yyyy') }}</span>
					<b-icon icon="chevron-down" />
				</template>
				<b-dropdown-header id="dropdown-header-label"> Ver métricos por </b-dropdown-header>
				<template v-for="(scope, index) in montScopeOptions">
					<b-dropdown-item-button :key="index" @click="selectedScope=scope">
						<b-icon :icon="selectedScope === scope ? 'check' : 'blank'" aria-hidden="true" />
						<span v-if="scope" class="body-title-5">{{ scope.toFormat('MMMM yyyy') }}</span>
					</b-dropdown-item-button>
				</template>
			</b-dropdown>
		</div>
		<div class="chart-container">
			<div v-if="chartDay.datasets.length > 1" class="line-chart">
				<line-chart
					ref="chartDay"
					class="w-100 h-100"
					:chart-data="chartDay"
					:options="options"
				/>
			</div>
		</div>
	</article>
</template>
<script>
import { mapGetters } from 'vuex'
import { fillEmptyDaysGroupingByMonth, formatByDayGroupingByMonth } from './analysisStudytimeChartCalculations.js'
import LineChart from '@/components/_functional/LineChart.vue'
const { DateTime } = require('luxon')
export default {
	components: {
		LineChart
	},
	data: () => ({
		selectedScope: DateTime.utc().startOf('month'),
		subscriptionMonths: null,
		studyTimesDaysGroupedByMonth: null,
		globalStudyTimesDaysGroupedByMonth: null,
		montScopeOptions: null,
		bestScopeData: null,
		chartDay: { labels: [], datasets: [] },
		layerMap: [{ title: 'Mis horas de estudio', color: '#FF9300' }, { title: 'Horas de estudio promedio de todos los usuarios', color: '#818FF9' }],
		options: {
			maintainAspectRatio: false,
			legend: {
				labels: {
					fontColor: '#000000',
					fontFamily: "'Avenir', sans-serif",
					fontSize: 14,
					fontStyle: 'bold',
					usePointStyle: true,
					padding: 60
				},
				afterFit: () => 600
			},
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
						fontSize: 14
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
			},
			elements: {
				line: {
					fill: 'bottom',
					tension: 0.5
				}
			}
		}
	}),
	computed: {
		...mapGetters({
			student: 'user',
			studyTime: 'studytime/studyTime',
			communityStats: 'community_stats/communityStats'
		})
	},
	watch: {
		student () {
			console.log('student')
			this.initialize()
		},
		studyTime () {
			console.log('studyTime')
			this.initialize()
		},
		communityStats () {
			console.log('communityStats')
			this.initialize()
		},
		selectedScope () {
			console.log('selectedScope')
			this.initialize()
			if (this.$refs.chartDay) {
				setTimeout(() => {
					this.$refs.chartDay.remoteRenderChart()
				}, 1)
			}
		}
	},
	mounted () {
		console.log('mounted')
		this.initialize()
	},
	beforeUpdate () {
		console.log('beforeUpdate')
		this.initialize()
	},
	methods: {
		initialize () {
			this.calculeStudentSubscriptionMonths()
			this.calculeGlobalStudyTimesDaysGroupedByMonth()
			this.calculeStudyTimesDaysGroupedByMonth()
			this.calculeStudentCurrentMonth()
		},
		calculeStudentSubscriptionMonths () {
			if (this.student && this.subscriptionMonths == null) {
				const subcriptionStartAt = DateTime.fromISO(this.student.paid_at, { zone: 'utc' })
				const subcriptionEndAt = DateTime.fromISO(this.student.end_date, { zone: 'utc' })
				this.subscriptionMonths = fillEmptyDaysGroupingByMonth(subcriptionStartAt, subcriptionEndAt)
				this.montScopeOptions = Object.values(this.subscriptionMonths).map(sm => sm.date)
			}
		},
		calculeGlobalStudyTimesDaysGroupedByMonth () {
			if (this.communityStats && this.subscriptionMonths && this.globalStudyTimesDaysGroupedByMonth == null) {
				this.globalStudyTimesDaysGroupedByMonth = formatByDayGroupingByMonth(this.communityStats.days)
			}
		},
		calculeStudyTimesDaysGroupedByMonth () {
			if (this.studyTime && this.subscriptionMonths && this.studyTimesDaysGroupedByMonth == null) {
				this.studyTimesDaysGroupedByMonth = formatByDayGroupingByMonth(this.studyTime.days)
			}
		},
		calculeStudentCurrentMonth () {
			if (this.studyTimesDaysGroupedByMonth && this.globalStudyTimesDaysGroupedByMonth) {
				console.log('calculeStudentCurrentMonth')
				const selectedScopeDataStudent = this.calculeDatasetByMonth(this.selectedScope.toFormat('yyyyMM'), this.studyTimesDaysGroupedByMonth)
				const selectedScopeDataGlobal = this.calculeDatasetByMonth(this.selectedScope.toFormat('yyyyMM'), this.globalStudyTimesDaysGroupedByMonth)
				this.fillChart([selectedScopeDataStudent, selectedScopeDataGlobal])
			}
		},
		calculeDatasetByMonth (monthKey, studyTimesDaysGroupedByMonth) {
			// emptyMonthRef tiene un archivo de los meses de suscripción del usuario con sus mapa de días por mes con horas de estudio vacías
			// studyTimeMonthRef tiene un archivo de los studyTimes del usuario sólo con algunos meses y algunos días donde el student estudió
			// mergedDays rellena con los días donde el student estudió (esto se hizo para que no quedaran días vacíos)
			// scopedMonthRef crea un nuevo objeto resultado de la combinación de subscriptionMonths/studyTimesDaysGroupedByMonth en el mes scope
			// (esto se hizo para calcular una sola vez subscriptionMonths/studyTimesDaysGroupedByMonth y sólo hacer switch en el scope)
			const emptyMonthRef = this.subscriptionMonths[monthKey]
			const studyTimeMonthRef = studyTimesDaysGroupedByMonth[monthKey]
			let scopedMonthRef = Object.assign({}, emptyMonthRef)
			if (studyTimeMonthRef) { // Sólo si hay registros de studyTimesDaysGroupedByMonth en el mes scope
				const mergedDays = { ...emptyMonthRef.days, ...studyTimeMonthRef.days }
				scopedMonthRef = Object.assign({}, studyTimeMonthRef, { days: mergedDays })
			} // De lo contrario se envía vacío
			const title		= DateTime.fromISO(scopedMonthRef.start_on).toFormat('MMMM yyyy')
			const labels	= Object.keys(scopedMonthRef.days)
			const values	= Object.values(scopedMonthRef.days)
			return [title, labels, values]
		},
		fillChart (data) {
			this.chartDay.labels = []
			this.chartDay.datasets = data.map(([title, labels, values], idx) => {
				this.chartDay.labels = this.chartDay.labels > labels ? this.chartDay.labels : labels
				const layer = this.layerMap[idx]
				return {
					label: `${layer.title}`,
					data: values,
					borderWidth: 2,
					borderColor: layer.color,
					backgroundColor: (context) => {
						const chart = context.chart
						const { ctx, chartArea } = chart
						if (!chartArea) {
							return `${layer.color}DD`
						}
						const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
						gradient.addColorStop(0, `${layer.color}C0`)
						gradient.addColorStop(1, `${layer.color}10`)
						return gradient
					}
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	article {
		.controls {
			position: relative;
			z-index: 1;
		}
		.chart-container {
			position: relative;
			.line-chart {
				height: 300px;
				margin-top: -60px;
			}
		}
		h2 {
			font-weight: 900;
		}
	}
</style>
