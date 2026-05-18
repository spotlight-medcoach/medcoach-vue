<template>
  <div class="rw-capture">
    <p class="rw-capture__label">Adjunta una captura para ayudarnos a entender el problema.</p>

    <div class="rw-capture__actions">
      <button
        class="rw-capture__btn"
        :disabled="capturing || recording"
        @click="captureScreenshot"
      >
        <i class="fas fa-camera" />
        {{ capturing ? 'Capturando...' : 'Capturar pantalla' }}
      </button>

      <button
        v-if="canRecord"
        class="rw-capture__btn"
        :disabled="capturing"
        @click="recording ? stopRecording() : startRecording()"
      >
        <i :class="recording ? 'fas fa-stop-circle' : 'fas fa-video'" />
        {{ recording ? 'Detener grabación' : 'Grabar pantalla' }}
      </button>
    </div>

    <div v-if="previewUrl" class="rw-capture__preview">
      <img v-if="captureType === 'screenshot'" :src="previewUrl" alt="Vista previa">
      <video v-else :src="previewUrl" controls />
    </div>

    <button class="rw-capture__skip" @click="$emit('skipped')">
      Continuar sin adjunto <i class="fas fa-arrow-right" />
    </button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  name: 'ReportWidgetCapture',
  data () {
    return {
      capturing: false,
      recording: false,
      captureType: null,
      previewUrl: null,
      mediaRecorder: null,
      chunks: [],
    };
  },
  computed: {
    canRecord () {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
    },
  },
  methods: {
    async captureScreenshot () {
      this.capturing = true;
      this.$root.$emit('report-widget:hide');
      await this.$nextTick();

      try {
        const canvas = await html2canvas(document.body, {
          useCORS: true,
          allowTaint: false,
          scale: window.devicePixelRatio || 1,
        });

        this.$root.$emit('report-widget:show');

        canvas.toBlob((blob) => {
          this.captureType = 'screenshot';
          this.previewUrl = URL.createObjectURL(blob);
          this.capturing = false;
          this.$emit('captured', { file: blob, type: 'screenshot' });
        }, 'image/png');
      } catch (err) {
        this.$root.$emit('report-widget:show');
        this.capturing = false;
        console.error(err);
      }
    },

    async startRecording () {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: false,
        });

        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        this.chunks = [];

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) { this.chunks.push(e.data); }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { type: 'video/webm' });
          stream.getTracks().forEach((t) => t.stop());
          this.captureType = 'recording';
          this.previewUrl = URL.createObjectURL(blob);
          this.recording = false;
          this.$emit('captured', { file: blob, type: 'recording' });
        };

        this.mediaRecorder.start();
        this.recording = true;
      } catch (err) {
        if (err.name !== 'AbortError') { console.error(err); }
      }
    },

    stopRecording () {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
    },
  },
};
</script>

<style scoped>
.rw-capture__label {
  font-size: 13px;
  color: #6c757d;
  margin: 0 0 14px;
}
.rw-capture__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.rw-capture__btn {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #fe9400;
  border-radius: 8px;
  background: #fff;
  color: #fe9400;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background .2s, color .2s;
  display: flex;
  align-items: center;
  gap: 7px;
  justify-content: center;
}
.rw-capture__btn:hover:not(:disabled) { background: #fe9400; color: #fff; }
.rw-capture__btn:disabled { opacity: .5; cursor: not-allowed; }

.rw-capture__preview {
  margin-top: 14px;
  border-radius: 8px;
  overflow: hidden;
  max-height: 160px;
}
.rw-capture__preview img,
.rw-capture__preview video {
  width: 100%;
  max-height: 160px;
  object-fit: contain;
  background: #000;
}

.rw-capture__skip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #6c757d;
  font-size: 13px;
  cursor: pointer;
  margin-top: 16px;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.rw-capture__skip:hover { color: #212529; }
</style>
