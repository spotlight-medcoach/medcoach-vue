<template>
  <transition name="fade" appear>
    <div
      v-if="show"
      key="quiz-modal"
      class="quiz-modal-overlay"
      @click.self="close"
    >
      <div class="quiz-modal-container">
        <button class="quiz-modal-close" @click="close">
          <b-icon icon="x" font-scale="1.2" />
        </button>
        <iframe
          v-if="quizUrl"
          :src="quizUrl"
          class="quiz-iframe"
          frameborder="0"
          allowfullscreen
        />
        <div v-else class="quiz-empty">
          <p class="text-muted">No hay quiz disponible</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'QuizModal',
  props: {
    quizUrl: {
      type: String,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show (newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    },
  },
  beforeDestroy () {
    document.body.style.overflow = 'auto';
  },
  methods: {
    close () {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.quiz-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.quiz-modal-container {
  background-color: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.quiz-modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
}

.quiz-iframe {
  width: 100%;
  height: 90vh;
  min-height: 500px;
  border: none;
  display: block;
}

.quiz-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  padding: 20px;
}

// Fade animation
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
</style>
