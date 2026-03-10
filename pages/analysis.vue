<template>
  <div id="analysis" class="analytics-page p-3 p-md-4">
    <div v-if="loading" class="analytics-state">
      Cargando analíticos...
    </div>

    <div v-else-if="error" class="analytics-state analytics-error">
      {{ error }}
    </div>

    <template v-else>
      <section class="analytics-card profile-card">
        <div class="profile-left">
          <analysis-medscore-ring
            :score="medScore"
            :photo-url="studentPhoto"
            :alt="studentFullName"
            :size="145"
          />
        </div>
        <div class="profile-right">
          <h2 class="student-name">{{ studentFullName }}</h2>
          <p class="student-subtitle">Tus analíticos de estudio</p>
          <div class="profile-metrics">
            <div class="metric-item">
              <span class="metric-label">Preguntas respondidas</span>
              <span class="metric-value">{{ answeredTotal }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Cobertura del banco</span>
              <span class="metric-value">{{ coveragePct }}%</span>
            </div>
          </div>
        </div>
      </section>

      <section class="analytics-grid mt-3">
        <article class="analytics-card chart-card">
          <h3 class="heading-6 mb-3">Horas de estudio diarias</h3>
          <div v-if="studyChartData.datasets.length" class="line-chart-container">
            <line-chart
              class="h-100"
              :chart-data="studyChartData"
              :options="studyChartOptions"
            />
          </div>
          <p v-else class="empty-text mb-0">Aun no hay horas de estudio registradas.</p>
        </article>

        <article class="analytics-card donut-card">
          <h3 class="heading-6 mb-3">Banco de preguntas</h3>
          <div class="donut-wrap">
            <doughnut-chart class="donut-chart-sm" :chart-data="bankChartData" :options="donutOptions" />
          </div>
        </article>

        <article class="analytics-card donut-card">
          <h3 class="heading-6 mb-3">Respondidas por categoria</h3>
          <div v-if="categoryChartData.datasets.length" class="donut-wrap">
            <doughnut-chart class="donut-chart-sm" :chart-data="categoryChartData" :options="donutOptions" />
          </div>
          <p v-else class="empty-text mb-0">Aun no hay preguntas respondidas por categoria.</p>
        </article>
      </section>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LineChart from '@/components/_functional/LineChart.vue';
import DoughnutChart from '@/components/_functional/DoughnutChart.vue';
import AnalysisMedscoreRing from '@/components/analysis/AnalysisMedscoreRing.vue';

export default {
  layout: 'new_default',
  components: {
    LineChart,
    DoughnutChart,
    AnalysisMedscoreRing,
  },
  computed: {
    ...mapGetters({
      studentInfo: 'user',
      overview: 'student_analytics/overview',
      studyHoursDaily: 'student_analytics/studyHoursDaily',
      questionsBank: 'student_analytics/questionsBank',
      questionsByCategory: 'student_analytics/questionsByCategory',
      loading: 'student_analytics/loading',
      error: 'student_analytics/error',
    }),
    studentName () {
      return this.overview?.student?.name || this.studentInfo?.name || '';
    },
    studentLastName () {
      return this.overview?.student?.last_name || this.studentInfo?.last_name || '';
    },
    studentFullName () {
      const fullName = `${this.studentName} ${this.studentLastName}`.trim();
      return fullName || 'Estudiante';
    },
    studentPhoto () {
      return this.overview?.student?.photo_url || this.studentInfo?.photo_url || '';
    },
    medScore () {
      return Number(this.overview?.med_score || this.studentInfo?.medscore || 0);
    },
    answeredTotal () {
      return this.questionsBank?.answered_total || 0;
    },
    bankTotal () {
      return this.questionsBank?.bank_total || 0;
    },
    pendingTotal () {
      return this.questionsBank?.pending_total || 0;
    },
    coveragePct () {
      return this.questionsBank?.coverage_pct || 0;
    },
    studyChartData () {
      const labels = this.studyHoursDaily.map((item) => this.formatDateLabel(item.date));
      const values = this.studyHoursDaily.map((item) => item.reading_hours || 0);
      if (!labels.length) {
        return { labels: [], datasets: [] };
      }
      return {
        labels,
        datasets: [
          {
            label: 'Horas por dia',
            data: values,
            borderWidth: 2,
            borderColor: '#FF9300',
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                return '#FF930044';
              }
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, '#FF9300B3');
              gradient.addColorStop(1, '#FF930012');
              return gradient;
            },
            fill: true,
            tension: 0.35,
          },
        ],
      };
    },
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
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            fontSize: 11,
          },
        },
        cutoutPercentage: 70,
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const value = dataset.data[tooltipItem.index];
              const label = data.labels[tooltipItem.index];
              return `${label}: ${value}`;
            },
          },
        },
      };
    },
    studyChartOptions () {
      return {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 6,
              },
              gridLines: {
                color: '#f1f1ed',
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.yLabel} hrs`,
          },
        },
      };
    },
  },
  mounted () {
    this.$store.dispatch('student_analytics/fetchAnalytics');
  },
  methods: {
    formatDateLabel (isoDate) {
      if (!isoDate || typeof isoDate !== 'string') {
        return '';
      }
      const [year, month, day] = isoDate.split('-').map(Number);
      if (!year || !month || !day) {
        return isoDate;
      }

      const safeDate = new Date(Date.UTC(year, month - 1, day));
      const monthShort = new Intl.DateTimeFormat('es-MX', {
        month: 'short',
        timeZone: 'UTC',
      })
        .format(safeDate)
        .replace('.', '')
        .toLowerCase();

      return `${String(day).padStart(2, '0')}/${monthShort}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.analytics-page {
  min-height: calc(100vh - 120px);
}
.analytics-state {
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  text-align: center;
}
.analytics-error {
  color: #b3261e;
}
.analytics-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}
.profile-card {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  align-items: center;
}
.student-name {
  margin-bottom: 4px;
}
.student-subtitle {
  color: #707070;
  margin-bottom: 14px;
}
.profile-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 12px;
}
.metric-item {
  background: #f8f8f6;
  border-radius: 10px;
  padding: 10px 12px;
}
.metric-label {
  display: block;
  font-size: 12px;
  color: #787878;
}
.metric-value {
  font-size: 18px;
  font-weight: 700;
}
.analytics-grid {
  display: grid;
  grid-template-columns: 4fr 3fr 3fr;
  gap: 16px;
}
.chart-card {
  min-height: 300px;
}
.line-chart-container {
  height: 230px;
}
.donut-card {
  min-height: 320px;
  display: flex;
  flex-direction: column;
}
.donut-wrap {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.donut-chart-sm {
  width: 220px !important;
  height: 220px !important;
  max-width: 220px !important;
  max-height: 220px !important;
}
.donut-caption {
  text-align: center;
  font-size: 14px;
  color: #5f5f5f;
}
.empty-text {
  color: #7f7f7f;
}
@media (max-width: 1200px) {
  .analytics-grid {
    grid-template-columns: 1fr 1fr;
  }
  .chart-card {
    grid-column: 1 / -1;
  }
}
@media (max-width: 768px) {
  .profile-card {
    grid-template-columns: 1fr;
  }
  .profile-left {
    display: flex;
    justify-content: center;
  }
  .profile-metrics {
    grid-template-columns: 1fr;
  }
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
