<template>
  <div class="rw-form">
    <!-- Vista previa del adjunto (bug/suggestion) -->
    <div v-if="previewUrl" class="rw-form__thumb">
      <img v-if="captureType === 'screenshot'" :src="previewUrl" alt="Adjunto">
      <span v-else class="rw-form__video-badge"><i class="fas fa-video" /> Grabación adjunta</span>
    </div>

    <!-- Rating de estrellas (feedback) -->
    <div v-if="reportType === 'feedback'" class="rw-form__stars">
      <p class="rw-form__stars-label">¿Cómo calificarías tu experiencia?</p>
      <div class="rw-form__stars-row">
        <button
          v-for="n in 5"
          :key="n"
          :class="['rw-form__star', { 'rw-form__star--active': n <= rating }]"
          @click="rating = n"
        >
          <i class="fas fa-star" />
        </button>
      </div>
    </div>

    <!-- Descripción -->
    <div class="rw-form__field">
      <label>{{ descLabel }} <span v-if="reportType !== 'feedback'" class="rw-form__required">*</span></label>
      <textarea
        v-model="description"
        :placeholder="descPlaceholder"
        rows="4"
        maxlength="2000"
      />
    </div>

    <p v-if="error" class="rw-form__error">{{ error }}</p>

    <div class="rw-form__actions">
      <button class="rw-form__cancel" @click="$emit('cancel')">Cancelar</button>
      <button
        class="rw-form__submit"
        :disabled="loading || !canSubmit"
        @click="submit"
      >
        <span v-if="loading"><i class="fas fa-spinner fa-spin" /> Enviando...</span>
        <span v-else>Enviar reporte</span>
      </button>
    </div>
  </div>
</template>

<script>
import { submitReport } from '@/services/reports.service';

export default {
  name: 'ReportWidgetForm',
  props: {
    reportType: { type: String, default: 'bug' },
    captureFile: { type: Blob, default: null },
    captureType: { type: String, default: null },
    previewUrl: { type: String, default: null },
  },
  data () {
    return {
      description: '',
      rating: 0,
      loading: false,
      error: null,
    };
  },
  computed: {
    descLabel () {
      const labels = {
        bug: 'Descripción del error',
        suggestion: 'Describe tu sugerencia',
        feedback: 'Comentarios adicionales (opcional)',
      };
      return labels[this.reportType] || 'Descripción';
    },
    descPlaceholder () {
      const ph = {
        bug: '¿Qué estabas haciendo cuando ocurrió el error? ¿Qué esperabas que pasara?',
        suggestion: 'Describe la funcionalidad o mejora que te gustaría ver en MedCoach...',
        feedback: 'Cuéntanos qué te ha parecido la plataforma, qué mejorarías...',
      };
      return ph[this.reportType] || 'Describe el problema...';
    },
    canSubmit () {
      if (this.reportType === 'feedback') {
        return this.rating > 0;
      }
      return this.description.trim().length > 0;
    },
  },
  methods: {
    async submit () {
      this.loading = true;
      this.error = null;
      try {
        await submitReport({
          file: this.captureFile,
          captureType: this.captureType,
          reportType: this.reportType,
          description: this.description,
          rating: this.reportType === 'feedback' ? this.rating : undefined,
        });
        this.$emit('success');
      } catch (err) {
        this.error = 'Hubo un error al enviar el reporte. Intenta de nuevo.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.rw-form__thumb { margin-bottom: 12px; border-radius: 6px; overflow: hidden; }
.rw-form__thumb img { width: 100%; max-height: 110px; object-fit: cover; }
.rw-form__video-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f0f0f0; padding: 5px 10px; border-radius: 6px;
  font-size: 12px; color: #555;
}

/* Stars */
.rw-form__stars { margin-bottom: 14px; }
.rw-form__stars-label { font-size: 13px; font-weight: 600; color: #444; margin: 0 0 8px; }
.rw-form__stars-row { display: flex; gap: 6px; }
.rw-form__star {
  background: none; border: none; cursor: pointer;
  font-size: 24px; color: #dee2e6; padding: 0;
  transition: color .15s, transform .1s;
}
.rw-form__star:hover,
.rw-form__star--active { color: #fe9400; }
.rw-form__star:hover { transform: scale(1.15); }

/* Form fields */
.rw-form__field { margin-bottom: 14px; }
.rw-form__field label {
  display: block; font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .6px;
  color: #6c757d; margin-bottom: 6px;
}
.rw-form__required { color: #dc3545; }
.rw-form__field textarea {
  width: 100%; border: 1px solid #dee2e6; border-radius: 8px;
  padding: 9px 12px; font-size: 13px; font-family: inherit;
  resize: vertical; box-sizing: border-box; line-height: 1.5;
}
.rw-form__field textarea:focus { outline: none; border-color: #fe9400; }
.rw-form__error { color: #dc3545; font-size: 12px; margin-bottom: 8px; }

/* Actions */
.rw-form__actions { display: flex; justify-content: flex-end; gap: 10px; }
.rw-form__cancel {
  padding: 8px 16px; border: 1px solid #dee2e6; border-radius: 8px;
  background: #fff; cursor: pointer; font-size: 13px; color: #495057;
}
.rw-form__submit {
  padding: 8px 18px; border: none; border-radius: 8px;
  background: #fe9400; color: #fff; font-weight: 700;
  font-size: 13px; cursor: pointer; transition: background .15s;
  display: flex; align-items: center; gap: 6px;
}
.rw-form__submit:hover:not(:disabled) { background: #e07d00; }
.rw-form__submit:disabled { opacity: .6; cursor: not-allowed; }
</style>
