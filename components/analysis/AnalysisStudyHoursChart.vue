<template>
  <article class="analytics-card chart-card">
    <div class="chart-card__header mb-3">
      <h3 class="heading-6 mb-2">Horas de estudio diarias</h3>
      <div class="period-selector">
        <button
          v-for="p in studyPeriodOptions"
          :key="p.value"
          class="period-btn"
          :class="{ 'period-btn--active': studyPeriod === p.value }"
          @click="studyPeriod = p.value"
        >{{ p.label }}</button>
      </div>
    </div>
    <div class="line-chart-container">
      <line-chart class="h-100" :chart-data="studyChartData" :options="studyChartOptions" />
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import LineChart from '@/components/_functional/LineChart.vue';

export default {
  name: 'AnalysisStudyHoursChart',
  components: { LineChart },
  data () {
    return {
      studyPeriod: 'week',
      studyPeriodOptions: [
        { value: 'week', label: 'Semana' },
        { value: 'fortnight', label: 'Quincena' },
        { value: 'month', label: 'Mes' },
        { value: 'year', label: 'Año' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      studyHoursDaily: 'student_analytics/studyHoursDaily',
    }),
    filteredStudyDays () {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(today);
      if (this.studyPeriod === 'week') {
        const dow = today.getDay();
        startDate.setDate(today.getDate() + (dow === 0 ? -6 : 1 - dow));
      } else if (this.studyPeriod === 'fortnight') {
        startDate.setDate(today.getDate() - 14);
      } else if (this.studyPeriod === 'month') {
        startDate.setDate(today.getDate() - 29);
      } else {
        startDate.setDate(today.getDate() - 364);
      }
      const hoursMap = new Map();
      for (const d of this.studyHoursDaily) {
        hoursMap.set(d.date, d.study_hours || d.reading_hours || 0);
      }
      const days = [];
      const todayTime = today.getTime();
      const cur = new Date(startDate);
      while (cur.getTime() <= todayTime) {
        const key = cur.toISOString().slice(0, 10);
        days.push({ date: key, hours: hoursMap.get(key) || 0 });
        cur.setDate(cur.getDate() + 1);
      }
      return days;
    },
    studyChartData () {
      const days = this.filteredStudyDays;
      const labels = days.map((d) => this.formatDateLabel(d.date, this.studyPeriod));
      const values = days.map((d) => d.hours);
      return {
        labels,
        datasets: [
          {
            label: 'Horas por día',
            data: values,
            borderWidth: 2,
            borderColor: '#FF9300',
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) { return '#FF930044'; }
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, '#FF9300B3');
              gradient.addColorStop(1, '#FF930012');
              return gradient;
            },
            fill: true,
            tension: 0.35,
            pointRadius: this.studyPeriod === 'year' ? 0 : 3,
          },
        ],
      };
    },
    studyChartOptions () {
      const maxXTicks = { week: 7, fortnight: 15, month: 10, year: 12 }[this.studyPeriod] || 7;
      return {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [
            {
              ticks: { beginAtZero: true, maxTicksLimit: 6 },
              gridLines: { color: '#f1f1ed' },
            },
          ],
          xAxes: [
            {
              gridLines: { display: false },
              ticks: { maxTicksLimit: maxXTicks, autoSkip: true, maxRotation: 0 },
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
  methods: {
    formatDateLabel (isoDate, period) {
      if (!isoDate || typeof isoDate !== 'string') { return ''; }
      const [year, month, day] = isoDate.split('-').map(Number);
      if (!year || !month || !day) { return isoDate; }
      const safeDate = new Date(Date.UTC(year, month - 1, day));
      if (period === 'year') {
        return new Intl.DateTimeFormat('es-MX', { month: 'short', year: '2-digit', timeZone: 'UTC' })
          .format(safeDate).replace('.', '').toLowerCase();
      }
      const monthShort = new Intl.DateTimeFormat('es-MX', { month: 'short', timeZone: 'UTC' })
        .format(safeDate).replace('.', '').toLowerCase();
      return `${String(day).padStart(2, '0')}/${monthShort}`;
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
.chart-card { min-height: 300px; }
.chart-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.chart-card h3 { font-weight: 800; }
.period-selector { display: flex; gap: 4px; margin-bottom: 8px; width: 100%; justify-content: flex-end; }
.period-btn {
  padding: 4px 12px;
  border-radius: 99px;
  border: 1px solid #e7e7e1;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  color: #9a9a9a;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  &:hover { border-color: #ff9300; color: #ff9300; }
  &--active {
    background: #ff9300;
    border-color: #ff9300;
    color: #fff;
    &:hover { color: #fff; }
  }
}
.line-chart-container { height: 250px; }
</style>
