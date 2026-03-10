<template>
  <div class="med-score-ring-wrapper">
    <div class="ring-box" :style="ringBoxStyle">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="ring-svg">
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          :stroke="trackColor"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
        />
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          :stroke="progressColor"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="progress-ring"
          :transform="`rotate(-90 ${center} ${center})`"
        />
      </svg>

      <div class="photo-wrapper" :style="photoWrapperStyle">
        <img
          v-if="photoUrl"
          :src="photoUrl"
          :alt="alt"
          class="student-photo"
          :style="photoSizeStyle"
        />
        <div v-else class="student-photo-placeholder" :style="photoSizeStyle">
          <i class="fas fa-user" />
        </div>
      </div>
    </div>

    <div v-if="showLabel" class="score-label">
      <span class="score-value">{{ displayScore }}%</span>
      <span class="score-text">MedScore</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalysisMedscoreRing',
  props: {
    score: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 170,
    },
    strokeWidth: {
      type: Number,
      default: 10,
    },
    progressColor: {
      type: String,
      default: '#ff9300',
    },
    trackColor: {
      type: String,
      default: '#f3f3f0',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: 'Estudiante',
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      displayScore: 0,
    };
  },
  computed: {
    normalizedScore () {
      const numericScore = Number(this.score) || 0;
      return Math.max(0, Math.min(100, Math.round(numericScore)));
    },
    center () {
      return this.size / 2;
    },
    radius () {
      return (this.size - this.strokeWidth) / 2;
    },
    circumference () {
      return 2 * Math.PI * this.radius;
    },
    dashOffset () {
      const progress = this.normalizedScore / 100;
      return this.circumference * (1 - progress);
    },
    photoInnerSize () {
      return this.size - this.strokeWidth * 2 - 10;
    },
    ringBoxStyle () {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
      };
    },
    photoWrapperStyle () {
      return {
        width: `${this.photoInnerSize}px`,
        height: `${this.photoInnerSize}px`,
      };
    },
    photoSizeStyle () {
      return {
        width: `${this.photoInnerSize}px`,
        height: `${this.photoInnerSize}px`,
      };
    },
  },
  watch: {
    normalizedScore () {
      this.animateScore();
    },
  },
  mounted () {
    this.animateScore();
  },
  methods: {
    animateScore () {
      const target = this.normalizedScore;
      const duration = 900;
      const start = this.displayScore;
      const startTime = Date.now();

      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        this.displayScore = Math.round(start + (target - start) * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    },
  },
};
</script>

<style lang="scss" scoped>
.med-score-ring-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ring-box {
  position: relative;
}
.ring-svg {
  display: block;
}
.progress-ring {
  transition: stroke-dashoffset 0.9s ease;
}
.photo-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.student-photo {
  object-fit: cover;
  border-radius: 50%;
}
.student-photo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f3f0;
  color: #bbbbb3;
  font-size: 44px;
}
.score-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
.score-value {
  font-size: 20px;
  font-weight: 700;
  color: #ff9300;
}
.score-text {
  font-size: 11px;
  color: #979797;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
</style>
