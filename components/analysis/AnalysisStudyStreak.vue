<template>
  <div class="analytics-card metrics-card">
    <div class="metrics-card__header">
      <span class="metrics-card__icon">🔥</span>
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
        <span class="streak-progress__milestone">{{ nextMilestone }} DÍAS</span>
      </div>
      <div class="progress-bar-track">
        <div
          class="progress-bar-fill progress-bar-fill--accent"
          :style="{ width: streakProgressWidth }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AnalysisStudyStreak',
  computed: {
    ...mapGetters({
      studyHoursDaily: 'student_analytics/studyHoursDaily',
    }),
    studyStreak () {
      if (!this.studyHoursDaily.length) { return 0; }
      const daySet = new Set(
        this.studyHoursDaily
          .filter((d) => (d.core_study_hours || d.core_study_minutes / 60 || 0) > 0)
          .map((d) => d.date),
      );
      const localDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };
      let streak = 0;
      const checkDate = new Date();
      if (!daySet.has(localDateKey(checkDate))) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      while (true) {
        if (!daySet.has(localDateKey(checkDate))) { break; }
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      return streak;
    },
    milestones () {
      return [7, 14, 21, 28, 50, 100, 150, 200, 250, 300];
    },
    nextMilestone () {
      return this.milestones.find((m) => m > this.studyStreak) || this.milestones[this.milestones.length - 1];
    },
    prevMilestone () {
      const idx = this.milestones.indexOf(this.nextMilestone);
      return idx > 0 ? this.milestones[idx - 1] : 0;
    },
    streakProgressWidth () {
      const range = this.nextMilestone - this.prevMilestone;
      const progress = this.studyStreak - this.prevMilestone;
      const pct = Math.min(100, Math.round((progress / range) * 100));
      return pct + '%';
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
.metrics-card__subtitle {
  font-size: 13px;
  color: #707070;
  margin-bottom: 12px;
}
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
.streak-progress { margin-top: auto; }
.streak-progress__labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: #9a9a9a;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.streak-progress__milestone { color: #ff9300; }
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
  &--accent { background: linear-gradient(to right, #ffb347, #ff9300); }
}
</style>
