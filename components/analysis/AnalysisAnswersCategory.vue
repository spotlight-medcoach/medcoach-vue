<template>
	<article ref="my-general-progress">
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
						data: [65, 59, 90, 81, 56],
						fill: true,
						backgroundColor: 'rgba(0, 142, 255, 0.16597)',
						borderColor: '#008EFF',
						pointBackgroundColor: '#008EFF',
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor: '#008EFF'
					}]
				}"
				:options="options"
			/>
		</div>
	</article>
</template>
<script>
import { mapState } from 'vuex'
import RadarChart from '@/components/_functional/RadarChart.vue'
export default {
	components: {
		RadarChart
	},
	data: () => ({
		options: {
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
		const containerWidth = this.$refs['my-general-progress'].offsetWidth
		const nElements = this.topics.length + 1
		this.doughnutWidthContainer = this.calculeChartSize(containerWidth, nElements, 1)
	},
	methods: {
		calculeChartSize (containerSize, nElements, chartScale) {
			return Math.floor(containerSize / nElements * chartScale)
		},
		chartByTopic (totalValue, actualValue) {
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
		.radar-chart {
			width: 520px;
			margin-left: auto;
			margin-top: -50px;
			margin-bottom: -50px;
		}
	}
</style>
