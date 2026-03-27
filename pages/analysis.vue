<template>
  <div id="analysis" class="analytics-page p-3 p-md-4">
    <div class="analytics-inner">
      <div v-if="loading" class="analytics-state">
        Cargando analíticos...
      </div>

      <div v-else-if="error" class="analytics-state analytics-error">
        {{ error }}
      </div>

      <template v-else>
        <!-- Sección 1: Perfil del estudiante -->
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
            <h2 class="student-name">¡Buen día, Dr. {{ studentFullName }}!</h2>
            <p class="student-subtitle">Tus analíticos de estudio</p>
          </div>
        </section>

        <!-- Sección 2: Métricas clave -->
        <section class="metrics-grid mt-3">
          <!-- MedScore Global -->
          <div class="analytics-card metrics-card">
            <div class="metrics-card__header">
              <span class="metrics-card__icon metrics-card__icon--primary">📊</span>
              <span class="metrics-card__label">MedScore Global</span>
            </div>
            <div class="medscore-global">
              <div class="medscore-global__score">
                <span class="medscore-global__value">{{ medScore }}</span>
                <span class="medscore-global__total">/100</span>
              </div>
              <div v-if="medscoreDistribution" class="medscore-global__chart">
                <div class="dist-wrapper">
                  <svg
                    class="dist-svg"
                    viewBox="0 0 200 60"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <polyline
                      :points="distributionPolylinePoints"
                      fill="none"
                      stroke="#e2e8f0"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      :x1="studentLineX"
                      y1="0"
                      :x2="studentLineX"
                      y2="60"
                      stroke="#ff9300"
                      stroke-width="2"
                      stroke-dasharray="3 2"
                    />
                  </svg>
                  <div
                    class="dist-dot"
                    :style="{ left: (medscoreDistribution.student_score) + '%', top: studentDotPct + '%' }"
                  />
                </div>
                <div class="medscore-global__footer">
                  <span>P0</span>
                  <span class="medscore-global__percentile">TOP {{ topPercentile }}%</span>
                  <span>P100</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Racha de estudio -->
          <div class="analytics-card metrics-card">
            <div class="metrics-card__header">
              <span class="metrics-card__icon metrics-card__icon--accent">🔥</span>
              <span class="metrics-card__label">Racha de Estudio</span>
            </div>
            <div class="streak-display">
              <span class="streak-display__value">{{ studyStreak }}</span>
              <span class="streak-display__unit">DÍAS</span>
            </div>
            <p class="metrics-card__subtitle">¡Mantén el ritmo para alcanzar tu meta!</p>
            <div class="streak-progress mt-auto">
              <div class="streak-progress__labels">
                <span>SIGUIENTE HITO</span>
                <span class="streak-progress__milestone">21 DÍAS</span>
              </div>
              <div class="progress-bar-track">
                <div
                  class="progress-bar-fill progress-bar-fill--accent"
                  :style="{ width: streakProgressWidth }"
                />
              </div>
            </div>
          </div>

          <!-- Horas semanales -->
          <div class="analytics-card metrics-card">
            <div class="metrics-card__header">
              <span class="metrics-card__icon metrics-card__icon--primary">🕐</span>
              <span class="metrics-card__label">Horas Semanales</span>
            </div>
            <div class="hours-display">
              <span class="hours-display__value">{{ weeklyStudyHours }}</span>
              <span class="hours-display__unit">H</span>
            </div>
            <div class="hours-stats">
              <div class="hours-stats__row">
                <span>Tiempo/Pregunta:</span>
                <span class="hours-stats__value--primary">—</span>
              </div>
              <div class="hours-stats__row">
                <span>Horas totales:</span>
                <span class="hours-stats__value--muted">{{ totalStudyHours }}h</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Sección 3: Banco + Categorías -->
        <section class="detail-grid mt-3">
          <!-- Detalle Banco de Preguntas -->
          <div class="analytics-card detail-card">
            <h3 class="detail-card__title">Detalle de Banco de Preguntas</h3>
            <p class="detail-card__subtitle">Análisis de tu desempeño acumulado</p>

            <div class="bank-stats">
              <!-- Acierto global -->
              <div class="bank-stat-item">
                <div class="bank-stat-item__header">
                  <span class="bank-stat-item__label">Acierto Global</span>
                  <span class="bank-stat-item__value bank-stat-item__value--green">{{ bankAccuracyPct }}%</span>
                </div>
                <div class="progress-bar-track">
                  <div
                    class="progress-bar-fill progress-bar-fill--green"
                    :style="{ width: bankAccuracyPct + '%' }"
                  />
                </div>
                <div class="bank-stat-item__footer">
                  <span>Correctas: <strong>{{ questionsBank && questionsBank.correct_total || 0 }}</strong></span>
                  <span>Incorrectas: <strong>{{ bankIncorrect }}</strong></span>
                </div>
              </div>

              <!-- Uso del banco -->
              <div class="bank-stat-item">
                <div class="bank-stat-item__header">
                  <span class="bank-stat-item__label">Uso del Banco</span>
                  <span class="bank-stat-item__value bank-stat-item__value--primary">{{ bankUsagePct }}%</span>
                </div>
                <div class="progress-bar-track">
                  <div
                    class="progress-bar-fill progress-bar-fill--primary"
                    :style="{ width: bankUsagePct + '%' }"
                  />
                </div>
                <div class="bank-stat-item__footer">
                  <span>Respondidas: <strong>{{ answeredTotal }}</strong></span>
                  <span>Disponibles: <strong>{{ questionsBank && questionsBank.pending_total || 0 }}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Progreso por Bloque -->
          <div class="analytics-card detail-card">
            <h3 class="detail-card__title">Progreso por Bloque</h3>
            <div class="category-list">
              <div
                v-for="(topic, idx) in topManualsByTopic"
                :key="topic.topic_id || topic.topic_name"
                class="category-item"
              >
                <div class="category-item__header">
                  <span class="category-item__name">{{ topic.topic_name }}</span>
                  <span class="category-item__pct" :style="{ color: categoryColor(idx) }">
                    {{ topic.read_count }}/{{ topic.total_count }}
                    <span class="category-item__pct-small">({{ topic.coverage_pct }}%)</span>
                  </span>
                </div>
                <div class="progress-bar-track">
                  <div
                    class="progress-bar-fill"
                    :style="{ width: topic.coverage_pct + '%', background: categoryColor(idx) }"
                  />
                </div>
              </div>
              <p v-if="!topManualsByTopic.length" class="empty-text mb-0">
                Aún no hay manuales leídos.
              </p>
            </div>
          </div>
        </section>

        <!-- Sección 4: Gráficas existentes -->
        <section class="analytics-grid mt-3">
          <article class="analytics-card chart-card">
            <div class="chart-card__header mb-3">
              <h3 class="heading-6 mb-0">Horas de estudio diarias</h3>
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
              <line-chart
                class="h-100"
                :chart-data="studyChartData"
                :options="studyChartOptions"
              />
            </div>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LineChart from '@/components/_functional/LineChart.vue';
import DoughnutChart from '@/components/_functional/DoughnutChart.vue';
import AnalysisMedscoreRing from '@/components/analysis/AnalysisMedscoreRing.vue';

export default {
  components: {
    LineChart,
    DoughnutChart,
    AnalysisMedscoreRing,
  },
  layout: 'new_default',
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
      studentInfo: 'user',
      overview: 'student_analytics/overview',
      studyHoursDaily: 'student_analytics/studyHoursDaily',
      questionsBank: 'student_analytics/questionsBank',
      questionsByCategory: 'student_analytics/questionsByCategory',
      medscoreDistribution: 'student_analytics/medscoreDistribution',
      manualsByTopic: 'student_analytics/manualsByTopic',
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

    // ── Nuevas métricas ──────────────────────────────────────────────────

    currentWeekRange () {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dow = today.getDay(); // 0=Dom
      const diffToMonday = dow === 0 ? -6 : 1 - dow;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      return {
        start: monday.toISOString().slice(0, 10),
        end: today.toISOString().slice(0, 10),
      };
    },

    weeklyStudyHours () {
      const { start, end } = this.currentWeekRange;
      const total = this.studyHoursDaily
        .filter((d) => d.date >= start && d.date <= end)
        .reduce((sum, d) => sum + (d.study_hours || d.reading_hours || 0), 0);
      return Math.round(total * 10) / 10;
    },

    totalStudyHours () {
      const total = this.studyHoursDaily.reduce(
        (sum, d) => sum + (d.study_hours || d.reading_hours || 0),
        0,
      );
      return Math.round(total * 10) / 10;
    },

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

    studyStreak () {
      if (!this.studyHoursDaily.length) { return 0; }
      const daySet = new Set(
        this.studyHoursDaily
          .filter((d) => (d.study_hours || d.reading_hours || 0) > 0)
          .map((d) => d.date),
      );

      let streak = 0;
      const today = new Date();
      // Start from today; if no study today, start from yesterday
      const checkDate = new Date(today);
      const todayKey = checkDate.toISOString().slice(0, 10);
      if (!daySet.has(todayKey)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
        const key = checkDate.toISOString().slice(0, 10);
        if (!daySet.has(key)) { break; }
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      return streak;
    },

    streakProgressWidth () {
      const pct = Math.min(100, Math.round((this.studyStreak / 21) * 100));
      return pct + '%';
    },

    bankAccuracyPct () {
      const answered = this.questionsBank?.answered_total || 0;
      const correct = this.questionsBank?.correct_total || 0;
      if (!answered) { return 0; }
      return Math.round((correct / answered) * 100);
    },

    bankUsagePct () {
      return this.questionsBank?.coverage_pct || 0;
    },

    bankIncorrect () {
      const answered = this.questionsBank?.answered_total || 0;
      const correct = this.questionsBank?.correct_total || 0;
      return Math.max(0, answered - correct);
    },

    topManualsByTopic () {
      return this.manualsByTopic || [];
    },

    // ── MedScore distribución SVG ────────────────────────────────────────

    distributionPolylinePoints () {
      const dist = this.medscoreDistribution?.distribution;
      if (!dist || !dist.length) { return ''; }
      const max = Math.max(...dist, 1);
      const svgWidth = 200;
      const svgHeight = 60;
      const step = svgWidth / (dist.length - 1);
      return dist
        .map((val, i) => {
          const x = i * step;
          const y = svgHeight - (val / max) * (svgHeight - 4);
          return `${x},${y}`;
        })
        .join(' ');
    },

    studentLineX () {
      const score = this.medscoreDistribution?.student_score || 0;
      return (score / 100) * 200;
    },

    studentDotPct () {
      const dist = this.medscoreDistribution?.distribution;
      if (!dist || !dist.length) { return 50; }
      const score = this.medscoreDistribution?.student_score || 0;
      const bucket = score === 100 ? 9 : Math.floor(score / 10);
      const max = Math.max(...dist, 1);
      // Convert SVG y coordinate (0-60) to CSS top percentage (0-100%)
      const svgY = 60 - (dist[bucket] / max) * 56;
      return Math.round((svgY / 60) * 100);
    },

    topPercentile () {
      const percentile = this.medscoreDistribution?.student_percentile || 0;
      return Math.max(1, 100 - percentile);
    },

    // ── Gráficas existentes (sin modificar) ─────────────────────────────

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
      const maxXTicks = { week: 7, fortnight: 15, month: 10, year: 12 }[this.studyPeriod] || 7;
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
              gridLines: { display: false },
              ticks: {
                maxTicksLimit: maxXTicks,
                autoSkip: true,
                maxRotation: 0,
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
    categoryColor (idx) {
      const palette = ['#FF9300', '#818FF9', '#3FB97A', '#FFC145', '#57CCF2', '#AE8CFB'];
      return palette[idx % palette.length];
    },
    formatDateLabel (isoDate, period) {
      if (!isoDate || typeof isoDate !== 'string') { return ''; }
      const [year, month, day] = isoDate.split('-').map(Number);
      if (!year || !month || !day) { return isoDate; }
      const safeDate = new Date(Date.UTC(year, month - 1, day));
      if (period === 'year') {
        return new Intl.DateTimeFormat('es-MX', { month: 'short', year: '2-digit', timeZone: 'UTC' })
          .format(safeDate)
          .replace('.', '')
          .toLowerCase();
      }
      const monthShort = new Intl.DateTimeFormat('es-MX', { month: 'short', timeZone: 'UTC' })
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
.analytics-inner {
  max-width: 1400px;
  margin: 0 auto;
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

// ── Perfil ────────────────────────────────────────────────────────────────
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

// ── Métricas clave ────────────────────────────────────────────────────────
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.metrics-card {
  display: flex;
  flex-direction: column;
  min-height: 220px;
}
.metrics-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.metrics-card__icon {
  font-size: 18px;
}
.metrics-card__label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9a9a9a;
}
.metrics-card__subtitle {
  font-size: 13px;
  color: #707070;
  margin-bottom: 12px;
}

// MedScore global
.medscore-global__score {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}
.medscore-global__value {
  font-size: 52px;
  font-weight: 900;
  color: #ff9300;
  line-height: 1;
}
.medscore-global__total {
  font-size: 22px;
  font-weight: 700;
  color: #d0d0d0;
}
.medscore-global__chart {
  margin-top: auto;
}
.dist-wrapper {
  position: relative;
  width: 100%;
  height: 60px;
}
.dist-svg {
  width: 100%;
  height: 60px;
  display: block;
}
.dist-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff9300;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.medscore-global__footer {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  color: #9a9a9a;
  text-transform: uppercase;
  margin-top: 4px;
}
.medscore-global__percentile {
  color: #ff9300;
  font-weight: 900;
}

// Racha
.streak-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}
.streak-display__value {
  font-size: 52px;
  font-weight: 900;
  color: #1a1a1a;
  line-height: 1;
}
.streak-display__unit {
  font-size: 20px;
  font-weight: 700;
  color: #ff9300;
}
.streak-progress {
  margin-top: auto;
}
.streak-progress__labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: #9a9a9a;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.streak-progress__milestone {
  color: #ff9300;
}

// Horas semanales
.hours-display {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
}
.hours-display__value {
  font-size: 52px;
  font-weight: 900;
  color: #1a1a1a;
  line-height: 1;
}
.hours-display__unit {
  font-size: 22px;
  font-weight: 700;
  color: #9a9a9a;
}
.hours-stats {
  background: #f8f8f6;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
}
.hours-stats__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #707070;
  & + & {
    margin-top: 6px;
  }
}
.hours-stats__value--primary {
  font-weight: 700;
  color: #ff9300;
}
.hours-stats__value--muted {
  font-weight: 600;
  color: #9a9a9a;
}

// ── Barras de progreso compartidas ────────────────────────────────────────
.progress-bar-track {
  width: 100%;
  height: 8px;
  background: #f1f1ed;
  border-radius: 99px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s ease;
  &--primary { background: #ff9300; }
  &--accent   { background: linear-gradient(to right, #ffb347, #ff9300); }
  &--green    { background: #3fb97a; }
  &--muted    { background: #bbbbb3; }
}

// ── Detalle banco + categorías ────────────────────────────────────────────
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.detail-card__title {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 4px;
}
.detail-card__subtitle {
  font-size: 12px;
  color: #9a9a9a;
  margin-bottom: 20px;
}
.bank-stats {
  display: flex;
  flex-direction: row;
  gap: 24px;
}
.bank-stat-item {
  flex: 1;
  min-width: 0;
}
.bank-stat-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.bank-stat-item__label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9a9a9a;
}
.bank-stat-item__value {
  font-size: 20px;
  font-weight: 900;
  &--green   { color: #3fb97a; }
  &--primary { color: #ff9300; }
}
.bank-stat-item__footer {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9a9a9a;
  margin-top: 6px;
}
.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.category-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.category-item__name {
  font-size: 13px;
  font-weight: 600;
  color: #3a3a3a;
}
.category-item__pct {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
.category-item__pct-small {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.75;
}

// ── Gráficas existentes ───────────────────────────────────────────────────
.chart-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.period-selector {
  display: flex;
  gap: 4px;
}
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
  &:hover {
    border-color: #ff9300;
    color: #ff9300;
  }
  &--active {
    background: #ff9300;
    border-color: #ff9300;
    color: #fff;
  }
}
.chart-card h3,
.donut-card h3 {
  font-weight: 800;
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
.empty-text {
  color: #7f7f7f;
}

// ── Responsive ────────────────────────────────────────────────────────────
@media (max-width: 1200px) {
  .analytics-grid {
    grid-template-columns: 1fr 1fr;
  }
  .chart-card {
    grid-column: 1 / -1;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 992px) {
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
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
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
