<template>
	<article>
		<h3 class="body-title-2 mb-3">Calificación por exámenes</h3>
		<div class="bar-chart">
			<bar-chart
				v-if="loaded"
				:chart-data="chartdata"
				:options="options"
			/>
		</div>
	</article>
</template>
<script>
import { mapState } from 'vuex'
import BarChart from '@/components/_functional/BarChart.vue'
export default {
	components: {
		BarChart
	},
	data: () => ({
		loaded: false,
		chartdata: {
			labels: ['1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			datasets: [{
				label: 'Calificación por exámenes',
				data: [65, 80, 30, 65],
				backgroundColor: '#FF930080',
				borderWidth: 0
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			legend: { display: false },
			scales: {
				yAxes: [{
					ticks: {
						min: 0,
						max: 100,
						// maxTicksLimit: 6,
						stepSize: 25,
						fontColor: '#1d1d1b66',
						fontFamily: "'Avenir', sans-serif",
						fontSize: 12
					}
				}],
				xAxes: [{
					maxBarThickness: 24,
					ticks: {
						min: 20,
						fontColor: '#000000',
						fontFamily: "'Avenir', sans-serif",
						fontSize: 14
					},
					gridLines: {
						display: false
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
				displayColors: false,
				callbacks: {
					title: () => {},
					label: tooltipItems => 'Calificación: ' + tooltipItems.yLabel
				}
			}
		}
	}),
	computed: {
		totalProgress () {
			return this.topics.reduce((acc, curr) => acc + curr.progress, 0)
		},
		totalManuals () {
			return this.topics.reduce((acc, curr) => acc + curr.total, 0)
		},
		...mapState({
			topics: state => state.topics.data,
			loaded: state => state.topics.fetchedManuals
		})
	},
	mounted () {
		setTimeout(() => {
			this.loaded = true
		}, 500)
	},
	methods: {
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
</style>
