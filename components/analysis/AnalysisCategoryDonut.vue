<template>
  <article class="analytics-card donut-card">
    <h3 class="heading-6 mb-3">Respondidas por categoria</h3>
    <div v-if="categoryChartData.datasets.length" class="donut-wrap">
      <doughnut-chart style="width:100%;height:100%;" :chart-data="categoryChartData" :options="donutOptions" />
    </div>
    <p v-else class="empty-text mb-0">
      Aun no hay preguntas respondidas por categoria.
    </p>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import DoughnutChart from '@/components/_functional/DoughnutChart.vue';

export default {
  name: 'AnalysisCategoryDonut',
  components: { DoughnutChart },
  computed: {
    ...mapGetters({
      questionsByCategory: 'student_analytics/questionsByCategory',
    }),
    categoryChartData () {
      if (!this.questionsByCategory.length) {
        return { labels: [], datasets: [] };
      }
      const colorPalette = ['#FF9300', '#818FF9', '#3FB97A', '#FFC145', '#57CCF2', '#AE8CFB'];
      return {
        labels: this.questionsByCategory.map((item) => item.category_name),
        datasets: [
          {
            data: this.questionsByCategory.map((item) => item.answered_total),
            backgroundColor: this.questionsByCategory.map(
              (_, index) => colorPalette[index % colorPalette.length],
            ),
            borderWidth: 0,
          },
        ],
      };
    },
    donutOptions () {
      return {
        maintainAspectRatio: false,
        legend: { display: true, position: 'bottom', labels: { boxWidth: 12, fontSize: 11 } },
        cutoutPercentage: 70,
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              const label = data.labels[tooltipItem.index];
              return `${label}: ${value}`;
            },
          },
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.analytics-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}
.donut-card {
  display: flex;
  flex-direction: column;
}
.donut-card h3 { font-weight: 800; }
.donut-wrap {
  height: 300px;
  position: relative;
  overflow: hidden;
}
.empty-text {
  font-size: 13px;
  color: #9a9a9a;
}
</style>
