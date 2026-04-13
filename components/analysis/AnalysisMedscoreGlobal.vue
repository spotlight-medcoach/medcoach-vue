<template>
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
      <div v-if="medscoreDistribution" class="medscore-global__percentile-row">
        <span class="medscore-global__percentile-label">Percentil Actual</span>
        <span class="medscore-global__top-badge">TOP {{ topPercentile }}%</span>
      </div>
      <div v-if="medscoreDistribution" class="medscore-global__chart">
        <div class="dist-wrapper">
          <svg
            class="dist-svg"
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="distFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#cbd5e0" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#cbd5e0" stop-opacity="0.05" />
              </linearGradient>
            </defs>
            <path
              :d="distributionPath"
              fill="url(#distFill)"
              stroke="#94a3b8"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <line
              :x1="studentLineX"
              :y1="studentCurveY"
              :x2="studentLineX"
              y2="60"
              stroke="#ff9300"
              stroke-width="1"
              stroke-dasharray="3 2"
            />
          </svg>
          <div
            class="dist-dot"
            :style="{ left: medscoreDistribution.student_score + '%', top: studentDotPct + '%' }"
          />
        </div>
        <div class="medscore-global__footer">
          <span>0</span>
          <span class="medscore-global__percentile">Tu posición ({{ medscoreDistribution.student_percentile }})</span>
          <span>100</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AnalysisMedscoreGlobal',
  computed: {
    ...mapGetters({
      overview: 'student_analytics/overview',
      studentInfo: 'user',
      medscoreDistribution: 'student_analytics/medscoreDistribution',
    }),
    medScore () {
      return Number(this.overview?.med_score || this.studentInfo?.medscore || 0);
    },
    _distParams () {
      const d = this.medscoreDistribution;
      if (!d) { return null; }
      const mean = d.mean ?? 50;
      const std = d.std || 15;
      const svgW = 200;
      const svgH = 60;
      const padTop = 12;
      const padBottom = 2;
      const pdf = (x) => {
        const z = (x - mean) / std;
        return Math.exp(-0.5 * z * z);
      };
      const toSvg = (x, p) => ({
        x: (x / 100) * svgW,
        y: svgH - padBottom - p * (svgH - padTop - padBottom),
      });
      return { mean, std, pdf, toSvg, svgW, svgH, padTop, padBottom };
    },
    distributionPath () {
      const p = this._distParams;
      if (!p) { return ''; }
      const pts = [];
      for (let x = 0; x <= 100; x++) {
        const { x: sx, y: sy } = p.toSvg(x, p.pdf(x));
        pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
      }
      const base = p.svgH - p.padBottom;
      return `M 0,${base} L ${pts.join(' L ')} L ${p.svgW},${base} Z`;
    },
    studentLineX () {
      const score = this.medscoreDistribution?.student_score || 0;
      return ((score / 100) * 200).toFixed(1);
    },
    studentCurveY () {
      const p = this._distParams;
      if (!p) { return 60; }
      const score = this.medscoreDistribution?.student_score || 0;
      return p.toSvg(score, p.pdf(score)).y.toFixed(1);
    },
    studentDotPct () {
      const p = this._distParams;
      if (!p) { return 50; }
      const score = this.medscoreDistribution?.student_score || 0;
      const svgY = p.toSvg(score, p.pdf(score)).y;
      return ((svgY / p.svgH) * 100).toFixed(1);
    },
    topPercentile () {
      const percentile = this.medscoreDistribution?.student_percentile || 0;
      return Math.max(1, 100 - percentile);
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
.medscore-global__score {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}
.medscore-global__percentile-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.medscore-global__percentile-label {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}
.medscore-global__top-badge {
  font-size: 11px;
  font-weight: 700;
  color: #374151;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 2px 8px;
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
.medscore-global__chart { margin-top: auto; }
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
</style>
