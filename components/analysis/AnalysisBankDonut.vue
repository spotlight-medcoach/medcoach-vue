<template>
  <article class="analytics-card donut-card">
    <h3 class="heading-6 mb-3">Banco de preguntas</h3>
    <div class="donut-wrap">
      <doughnut-chart style="width:100%;height:100%;" :chart-data="bankChartData" :options="donutOptions" />
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import DoughnutChart from '@/components/_functional/DoughnutChart.vue';

export default {
  name: 'AnalysisBankDonut',
  components: { DoughnutChart },
  computed: {
    ...mapGetters({
      questionsBank: 'student_analytics/questionsBank',
    }),
    answeredTotal () { return this.questionsBank?.answered_total || 0; },
    pendingTotal () { return this.questionsBank?.pending_total || 0; },
    bankChartData () {
      return {
        labels: ['Respondidas', 'Pendientes'],
        datasets: [
          {
            data: [this.answeredTotal, this.pendingTotal],
            backgroundColor: ['#FF9300', '#E7E7E1'],
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
</style>
