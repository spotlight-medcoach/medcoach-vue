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
          <analysis-medscore-global />
          <analysis-study-streak />
          <analysis-weekly-hours />
        </section>

        <!-- Sección 3: Banco + Categorías -->
        <section class="detail-grid mt-3">
          <analysis-bank-detail />
          <analysis-topic-progress />
        </section>

        <!-- Sección 4: Gráficas -->
        <section class="analytics-grid mt-3">
          <analysis-study-hours-chart />
          <analysis-bank-donut />
          <analysis-category-donut />
        </section>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AnalysisMedscoreRing from '@/components/analysis/AnalysisMedscoreRing.vue';
import AnalysisMedscoreGlobal from '@/components/analysis/AnalysisMedscoreGlobal.vue';
import AnalysisStudyStreak from '@/components/analysis/AnalysisStudyStreak.vue';
import AnalysisWeeklyHours from '@/components/analysis/AnalysisWeeklyHours.vue';
import AnalysisBankDetail from '@/components/analysis/AnalysisBankDetail.vue';
import AnalysisTopicProgress from '@/components/analysis/AnalysisTopicProgress.vue';
import AnalysisStudyHoursChart from '@/components/analysis/AnalysisStudyHoursChart.vue';
import AnalysisBankDonut from '@/components/analysis/AnalysisBankDonut.vue';
import AnalysisCategoryDonut from '@/components/analysis/AnalysisCategoryDonut.vue';

export default {
  components: {
    AnalysisMedscoreRing,
    AnalysisMedscoreGlobal,
    AnalysisStudyStreak,
    AnalysisWeeklyHours,
    AnalysisBankDetail,
    AnalysisTopicProgress,
    AnalysisStudyHoursChart,
    AnalysisBankDonut,
    AnalysisCategoryDonut,
  },
  layout: 'new_default',
  computed: {
    ...mapGetters({
      studentInfo: 'user',
      overview: 'student_analytics/overview',
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
  },
  mounted () {
    this.$store.dispatch('student_analytics/fetchAnalytics');
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
.student-name { margin-bottom: 4px; }
.student-subtitle {
  color: #707070;
  margin-bottom: 14px;
}

// ── Grids ─────────────────────────────────────────────────────────────────
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.analytics-grid {
  display: grid;
  grid-template-columns: 4fr 3fr 3fr;
  gap: 16px;
}
</style>
