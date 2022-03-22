<template>
	<article class="d-flex flex-column align-items-center">
		<div class="body-title-2 mb-4">
			<span class="text-secondary">MedScore</span>
			promedio de usuarios
		</div>
		<div class="chart-container">
			<div v-if="communityStats" class="line-chart">
				<line-chart
					v-if="communityStats.medscore_distribution"
					ref="chartDay"
					class="h-100 px-0"
					:chart-data="{
						labels: gaussDataset.labels,
						datasets: [{
							label: 'MedScore promedio de usuarios',
							data: gaussDataset.values,
							fill: false,
							borderColor: '#979797',
							pointRadius: 0
						}]
					}"
					:options="chartOptions"
				/>
				<div
					class="label-container global"
					:style="{'left': `${medscoreMedia}%`}"
				>
					<span class="label body-title-3 text-secondary text-center">{{ gaussDataset.labels[medscoreMedia] }}</span>
				</div>
				<div
					class="label-container student"
					:style="{'left': `${medscore}%`}"
				>
					<span class="label body-title-3 text-secondary text-center">{{ medscore }}</span>
				</div>
			</div>
		</div>
	</article>
</template>
<script>
import { mapGetters } from 'vuex'
import LineChart from '@/components/_functional/LineChart.vue'
export default {
	components: {
		LineChart
	},
	data: () => ({
		chartOptions: {
			maintainAspectRatio: false,
			legend: { display: false },
			scales: {
				yAxes: [{
					display: false,
					gridLines: {
						display: false
					}
				}],
				xAxes: [{
					display: false,
					gridLines: {
						display: false
					}
				}]
			}
		}
	}),
	computed: {
		medscore () {
			return this.studentInfo ? this.studentInfo.medscore : 0
		},
		medscoreMedia () {
			const max = Math.max(...this.gaussDataset.values)
			const maxIdx = this.gaussDataset.values.indexOf(max)
			return this.gaussDataset ? maxIdx : 0
		},
		gaussDataset () {
			if (this.communityStats && this.communityStats.medscore_distribution) {
				const distribution = this.communityStats.medscore_distribution
				return {
					labels: Object.keys(distribution),
					values: Object.values(distribution)
				}
			}
			return {}
		},
		...mapGetters({
			studentInfo: 'user',
			communityStats: 'community_stats/communityStats'
		})
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
				height: 280px;
				width: 700px;
				overflow-x: hidden;
				box-shadow: inset 0px -3px 0px 0px #979797;
				> *:first-child {
					margin-left: -13px;
					margin-right: -9px;
				}
			}
			.label-container {
				position: absolute;
				border: 1px solid #{$accent_b-500};
				width: 1px;
				top: 30px;
				bottom: 2px;
				.label {
					display: block;
					width: 60px;
					margin-top: -30px;
					margin-left: -30px;
					margin-left: -30px;
				}
			}
		}
		h2 {
			font-weight: 900;
		}
	}
</style>
