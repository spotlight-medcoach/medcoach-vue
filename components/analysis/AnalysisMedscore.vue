<template>
	<article>
		<div class="topic-container text-center">
			<h2 class="heading-6">MedScore</h2>
			<div
				class="chart-container d-flex justify-content-center align-items-center mx-auto my-3"
			>
				<div class="doughnut-chart">
					<doughnut-chart
						:chart-data="{
							datasets: [{
								data: [medscore, 100 - medscore],
								backgroundColor: ['#FF9300', '#BBBBB3']
							}]
						}"
						:options="{
							legend: { display: false },
							cutoutPercentage: 87,
							tooltips: {
								enabled: false
							}
						}"
					/>
				</div>
				<div v-if="medscore" class="caption-progress body-xxlg">
					<span class="heading-2">{{ medscoreSegmented.numerator }}</span>
					<span class="heading-6">.</span>
					<small class="body-title-1">{{ medscoreSegmented.denominator }}</small>
				</div>
			</div>
		</div>
	</article>
</template>
<script>
import { mapGetters } from 'vuex'
import DoughnutChart from '@/components/_functional/DoughnutChart.vue'
export default {
	components: {
		DoughnutChart
	},
	computed: {
		medscore () {
			return this.studentInfo ? this.studentInfo.medscore : 0
		},
		medscoreSegmented () {
			const medscoreSegmented = this.medscore.toString().split('.')
			return {
				numerator: medscoreSegmented[0],
				denominator: medscoreSegmented[1] ? medscoreSegmented[1] : 0
			}
		},
		...mapGetters({
			studentInfo: 'user'
		})
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	article {
		.chart-container {
			position: relative;
			.doughnut-chart {
				width: 228px;
				height: 228px;
			}
			.caption-progress {
				position: absolute;
				margin: auto;
				height: fit-content;
				width: fit-content;
				top: 0;
				left: 8px;
				right: 0;
				bottom: 4px;
			}
		}
	}
</style>
