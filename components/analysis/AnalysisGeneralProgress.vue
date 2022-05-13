<template>
	<article ref="my-general-progress">
		<h2 class="heading-6">Progreso general</h2>
		<div
			class="d-flex justify-content-between"
			:style="{'column-count': topics.length}"
		>
			<div v-for="(manual) in topics" :key="manual._id" class="topic-container text-center">
				<div
					class="chart-container d-flex justify-content-center align-items-center mx-auto mb-3"
					:style="{width: `${doughnutWidthContainer}px`, height: `${doughnutWidthContainer}px`}"
					:set="topicCalculations=calculePercentage(manual.total, manual.progress)"
				>
					<div class="doughnut-chart w-100 w-100">
						<doughnut-chart
							:chart-data="{
								labels: ['Pendientes','Estudiados'],
								datasets: [{
									data: [manual.progress || 0, manual.total || 100],
									backgroundColor: ['#FF9300', '#BBBBB3']
								}]
							}"
							:options="chartOptions"
						/>
					</div>
					<div class="caption-progress body-xxlg">{{ topicCalculations[0] }} %</div>
				</div>
				<h4>{{ manual.name }}</h4>
			</div>
			<div class="topic-container text-center">
				<div
					class="chart-container d-flex justify-content-center align-items-center mx-auto mb-3"
					:style="{width: `${doughnutWidthContainer}px`, height: `${doughnutWidthContainer}px`}"
					:set="topicCalculations=calculePercentage(totalManuals, totalProgress)"
				>
					<div class="doughnut-chart w-100 w-100">
						<doughnut-chart
							:chart-data="{
								labels: ['Estudiados','Pendientes'],
								datasets: [{
									data: [totalProgress || 0, totalManuals || 100],
									backgroundColor: ['#FF9300', '#BBBBB3']
								}]
							}"
							:options="chartOptions"
						/>
					</div>
					<div class="caption-progress body-xxlg">{{ topicCalculations[0] }} %</div>
				</div>
				<h4>Todas las materias</h4>
			</div>
		</div>
	</article>
</template>
<script>
import { mapState } from 'vuex'
import DoughnutChart from '@/components/_functional/DoughnutChart.vue'
export default {
	components: {
		DoughnutChart
	},
	data: () => ({
		doughnutWidthContainer: 200,
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
				yAlign: 'bottom',
				xAlign: 'center',
				displayColors: false,
				callbacks: {
					title: () => {},
					label: (tooltipItem, data) => {
						const indice = tooltipItem.index
						const tag = data.datasets[0].data[indice] === 1 ? 'manual' : 'manuales'
						return data.datasets[0].data[indice] + ' ' + tag
					}
				}
			},
			layout: {
				padding: {
					top: 32
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
		console.log('mounted mystudy')
		const containerWidth = this.$refs['my-general-progress'].offsetWidth
		const nElements = this.topics.length + 1
		this.doughnutWidthContainer = this.calculeChartSize(containerWidth, nElements, 1)
	},
	methods: {
		calculeChartSize (containerSize, nElements, chartScale) {
			console.log('chartSize', Math.floor((containerSize * 0.7) / nElements * chartScale))
			return Math.floor((containerSize * 0.7) / nElements * chartScale)
		},
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
			.caption-progress {
				position: absolute;
				margin: auto;
				height: fit-content;
				width: fit-content;
				top: 40px;
				left: 0;
				right: 0;
				bottom: 0;
			}
		}
		h2 {
			font-weight: 900;
		}
		h4 {
			font-size: 17px;
		}
	}
</style>
