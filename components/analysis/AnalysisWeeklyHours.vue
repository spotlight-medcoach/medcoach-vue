<template>
  <div class="analytics-card metrics-card">
    <div class="metrics-card__header">
      <span class="metrics-card__icon">🕐</span>
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
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AnalysisWeeklyHours',
  computed: {
    ...mapGetters({
      studyHoursDaily: 'student_analytics/studyHoursDaily',
    }),
    currentWeekRange () {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dow = today.getDay();
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
.metrics-card__icon { font-size: 18px; }
.metrics-card__label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9a9a9a;
}
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
  & + & { margin-top: 6px; }
}
.hours-stats__value--primary { font-weight: 700; color: #ff9300; }
.hours-stats__value--muted   { font-weight: 600; color: #9a9a9a; }
</style>
