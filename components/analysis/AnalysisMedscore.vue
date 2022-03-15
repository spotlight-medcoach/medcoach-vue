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
				<div class="caption-progress body-xxlg">
					<span class="heading-2">56</span>
					<span class="heading-6">.</span>
					<small class="body-title-1">234</small>
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
			return this.studentInfo.medscore
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
				left: 0;
				right: 0;
				bottom: 20px;
			}
		}
	}
</style>
