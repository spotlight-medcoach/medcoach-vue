<template>
  <transition :name="transitionName">
    <div v-if="visible" :class="['rw-panel', panelPositionClass]">
      <!-- Header -->
      <div class="rw-panel__header">
        <button v-if="currentStep !== 'type-select'" class="rw-panel__back" @click="goBack">
          <i class="fas fa-arrow-left" />
        </button>
        <span class="rw-panel__title">{{ stepTitle }}</span>
        <button class="rw-panel__close" @click="$emit('close')">
          <i class="fas fa-times" />
        </button>
      </div>

      <!-- Content -->
      <div class="rw-panel__body">
        <ReportWidgetTypeSelect
          v-if="currentStep === 'type-select'"
          @selected="onTypeSelected"
        />

        <ReportWidgetCapture
          v-else-if="currentStep === 'capture'"
          @captured="onCaptured"
          @skipped="onCaptureSkipped"
        />

        <ReportWidgetForm
          v-else-if="currentStep === 'form'"
          :report-type="selectedType"
          :capture-file="captureFile"
          :capture-type="captureType"
          :preview-url="previewUrl"
          @success="currentStep = 'success'"
          @cancel="$emit('close')"
        />

        <ReportWidgetSuccess
          v-else-if="currentStep === 'success'"
          @close="$emit('close')"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import ReportWidgetTypeSelect from './ReportWidgetTypeSelect.vue';
import ReportWidgetCapture from './ReportWidgetCapture.vue';
import ReportWidgetForm from './ReportWidgetForm.vue';
import ReportWidgetSuccess from './ReportWidgetSuccess.vue';

export default {
  name: 'ReportWidgetPanel',
  components: { ReportWidgetTypeSelect, ReportWidgetCapture, ReportWidgetForm, ReportWidgetSuccess },
  props: {
    openedFrom: {
      type: String,
      default: 'floating',
      validator: (v) => ['floating', 'tab'].includes(v),
    },
    tabPosition: {
      type: String,
      default: 'right',
      validator: (v) => ['left', 'right'].includes(v),
    },
    widgetPosition: {
      type: String,
      default: 'bottom-right',
    },
  },
  data () {
    return {
      visible: false,
      currentStep: 'type-select',
      selectedType: null,
      captureFile: null,
      captureType: null,
      previewUrl: null,
      stepHistory: [],
    };
  },
  computed: {
    transitionName () {
      if (this.openedFrom === 'tab') {
        return this.tabPosition === 'right' ? 'rw-slide-right' : 'rw-slide-left';
      }
      return 'rw-scale';
    },
    panelPositionClass () {
      if (this.openedFrom === 'tab') {
        return this.tabPosition === 'right' ? 'rw-panel--right' : 'rw-panel--left';
      }
      return this.widgetPosition === 'bottom-left' ? 'rw-panel--bottom-left' : 'rw-panel--bottom-right';
    },
    stepTitle () {
      const titles = {
        'type-select': 'Hacer un reporte',
        capture: 'Adjunta evidencia',
        form: this.selectedType === 'bug'
          ? 'Describe el error'
          : this.selectedType === 'suggestion'
            ? 'Cuéntanos tu idea'
            : 'Tu opinión',
        success: '',
      };
      return titles[this.currentStep] || '';
    },
  },
  mounted () {
    // Trigger enter animation after mount
    this.$nextTick(() => { this.visible = true; });
  },
  methods: {
    onTypeSelected (type) {
      this.selectedType = type;
      this.stepHistory.push('type-select');
      // feedback goes straight to form (no capture step)
      this.currentStep = type === 'feedback' ? 'form' : 'capture';
    },
    onCaptured ({ file, type }) {
      this.captureFile = file;
      this.captureType = type;
      this.previewUrl = URL.createObjectURL(file);
      this.stepHistory.push('capture');
      this.currentStep = 'form';
    },
    onCaptureSkipped () {
      this.captureFile = null;
      this.captureType = null;
      this.previewUrl = null;
      this.stepHistory.push('capture');
      this.currentStep = 'form';
    },
    goBack () {
      const prev = this.stepHistory.pop();
      if (prev) {
        this.currentStep = prev;
        if (prev === 'type-select') {
          this.selectedType = null;
          this.captureFile = null;
          this.captureType = null;
          this.previewUrl = null;
        }
      }
    },
  },
};
</script>

<style scoped>
.rw-panel {
  position: fixed;
  z-index: 10000;
  width: 360px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Positioning variants */
.rw-panel--bottom-right { bottom: 84px; right: 20px; }
.rw-panel--bottom-left  { bottom: 84px; left: 20px; }
.rw-panel--right        { bottom: 60px; right: 20px; }
.rw-panel--left         { bottom: 60px; left: 20px; }

/* Header */
.rw-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.rw-panel__title {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: #212529;
}

.rw-panel__back,
.rw-panel__close {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.rw-panel__back:hover,
.rw-panel__close:hover { background: #f0f0f0; color: #212529; }

/* Body */
.rw-panel__body { padding: 20px 16px 24px; }

/* ---- Animations ---- */

/* Scale up from button (floating) */
.rw-scale-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.rw-scale-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.rw-scale-enter        { opacity: 0; transform: scale(0.85); }
.rw-scale-leave-to     { opacity: 0; transform: scale(0.85); }

/* Slide from right (tab-right) */
.rw-slide-right-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.rw-slide-right-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.rw-slide-right-enter        { opacity: 0; transform: translateX(60px); }
.rw-slide-right-leave-to     { opacity: 0; transform: translateX(60px); }

/* Slide from left (tab-left) */
.rw-slide-left-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.rw-slide-left-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.rw-slide-left-enter        { opacity: 0; transform: translateX(-60px); }
.rw-slide-left-leave-to     { opacity: 0; transform: translateX(-60px); }
</style>
