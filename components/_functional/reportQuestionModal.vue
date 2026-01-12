<template>
  <b-modal
    id="report-question-modal"
    centered
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
  >
    <template #modal-title>
      <p class="title">Reportar Pregunta</p>
    </template>
    <div class="report-wrapper">
      <v-select
        class="select"
        placeholder="Tipo de problema"
        :options="typesProblems"
        :clearable="false"
        v-model="form.type"
      ></v-select>
      <textarea
        v-model="form.description"
        class="txt-area"
        rows="4"
        placeholder="Describe el problema"
      ></textarea>
      <div class="btn-container">
        <b-overlay
          :show="loading"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <button class="button" @click="sendReport">Enviar reporte</button>
        </b-overlay>
      </div>
    </div>
  </b-modal>
</template>
<script>
export default {
  name: 'case-report',
  props: {
    caseId: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      showForm: false,
      form: {
        type: null,
        description: '',
        case_id: null,
      },
      loading: false,
      typesProblems: [
        'Falta de ortografía',
        'Desactualizada',
        'Incomprensible',
        'Respuesta incorrecta',
        'Error de redacción',
        'Otros',
      ],
    };
  },
  methods: {
    showModal (event) {
      this.showForm = true;
      document.body.style.overflow = 'hidden';
      this.$store.commit('setShowStudentHeader', false);
    },
    hideModal (event) {
      this.showForm = false;
      this.$bvModal.hide('report-question-modal');
      this.$store.commit('setShowStudentHeader', true);
    },
    clearForm () {
      this.form.type = null;
      this.form.description = '';
    },
    async sendReport () {
      this.form.description = this.form.description.trim();
      if (!this.form.type) {
        this.$toastr.error('Debe seleccionar el tipo de problema', 'Error');
        return false;
      }
      if (this.form.description === '') {
        this.$toastr.error(
          'Debe introducir la descripción de su problema',
          'Error',
        );
        return false;
      }
      this.form.case_id = this.caseId;
      this.loading = true;
      try {
        await this.$axios.post('/report', this.form);
        this.$toastr.success(
          'Su reporte se ha guardado correctamente',
          'Éxito',
        );
        this.clearForm();
        this.hideModal();
      } catch (error) {
        console.error(error);
        this.$toastr.error('Hubo un problema al guardar el reporte', 'Error');
      }
      this.loading = false;
    },
  },
};
</script>
<style lang="scss">
#report-question-modal {
  .modal-content {
    width: 410px;
    padding: 15px 10px;
  }

  .title {
    font-family: 'Avenir';
    font-size: 24px;
    font-weight: 800;
    line-height: normal;
    color: rgba(0, 0, 0, 1);
    text-align: center;
    margin-bottom: 48px;
  }
  .report-wrapper {
    width: 100%;
    .txt-area {
      background-color: #ebebeb;
      padding: 8px 12px;
      width: 100%;
      margin-top: 28px;
      resize: none;
      border-radius: 8px;
      border: none;
      outline: none;
    }
    .btn-container {
      width: 100%;
      margin-top: 45px;
      display: flex;
      justify-content: center;
    }
    .button {
      color: white;
      background-color: #fe9501;
      padding: 11px 82px;
      margin: 0px auto;
      border: none;
      outline: none;
      border-radius: 4px;
      display: block;
    }
    .select {
      .vs__dropdown-toggle {
        border: none !important;
        border-bottom: 1px black solid !important;
        border-radius: 0px !important;
      }
      .vs__selected {
        /* color: gray !important; */
      }
      ::placeholder {
        color: gray !important;
      }
    }
  }
}
</style>
