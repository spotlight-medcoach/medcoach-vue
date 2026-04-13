<template>
  <div class="analytics-card detail-card">
    <h3 class="detail-card__title">Detalle de Banco de Preguntas</h3>
    <p class="detail-card__subtitle">Análisis de tu desempeño acumulado</p>
    <div class="bank-stats">
      <div class="bank-stat-item">
        <div class="bank-stat-item__header">
          <span class="bank-stat-item__label">Acierto Global</span>
          <span class="bank-stat-item__value bank-stat-item__value--green">{{ bankAccuracyPct }}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill progress-bar-fill--green" :style="{ width: bankAccuracyPct + '%' }" />
        </div>
        <div class="bank-stat-item__footer">
          <span>Correctas: <strong>{{ questionsBank && questionsBank.correct_total || 0 }}</strong></span>
          <span>Incorrectas: <strong>{{ bankIncorrect }}</strong></span>
        </div>
      </div>
      <div class="bank-stat-item">
        <div class="bank-stat-item__header">
          <span class="bank-stat-item__label">Uso del Banco</span>
          <span class="bank-stat-item__value bank-stat-item__value--primary">{{ bankUsagePct }}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill progress-bar-fill--primary" :style="{ width: bankUsagePct + '%' }" />
        </div>
        <div class="bank-stat-item__footer">
          <span>Respondidas: <strong>{{ questionsBank && questionsBank.answered_total || 0 }}</strong></span>
          <span>Disponibles: <strong>{{ questionsBank && questionsBank.pending_total || 0 }}</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AnalysisBankDetail',
  computed: {
    ...mapGetters({
      questionsBank: 'student_analytics/questionsBank',
    }),
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
  &--green   { background: #3fb97a; }
}
</style>
