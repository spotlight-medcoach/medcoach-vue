<template>
  <div id="case-report">
    <div id="form-report" v-if="showForm">
      <span class="cerrar" @click="hideModal">&times;</span>
      <div class="report-popup">
        <p class="title">Reportar Pregunta</p>
        <div class="report-wrapper">
          <v-select
            class="select"
            placeholder="Tipo de problema"
            :options="typesProblems"
            :clearable="false"
            v-model="form.type"
          ></v-select>
          <textarea v-model="form.description" class="txt-area" rows="4" placeholder="Describe el problema"></textarea>
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
      </div>
    </div>
    <div class="pop-report" v-else @click="showModal">
      <span class="small-text">R</span>
      <span class="full-text">Reportar Pregunta</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'case-report',
  props: {
    caseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showForm: false,
      form: {
        type: null,
        description: '',
        case_id: null
      },
      loading: false,
      typesProblems: [
        'Falta de ortografía',
        'Desactualizada',
        'Incomprensible',
        'Respuesta incorrecta',
        'Error de redacción',
        'Otros'
      ]
    }
  },
  methods: {
    showModal (event) {
      this.showForm = true
      document.body.style.overflow = 'hidden'
      this.$store.commit('setShowStudentHeader', false)
    },
    hideModal (event) {
      this.showForm = false
      document.body.style.overflow = 'auto'
      this.$store.commit('setShowStudentHeader', true)
    },
    clearForm () {
      this.form.type = null
      this.form.description = ''
    },
    async sendReport () {
      this.form.description = this.form.description.trim()
      if (!this.form.type) {
        this.$toastr.error('Debe seleccionar el tipo de problema', 'Error')
        return false
      }
      if (this.form.description === '') {
        this.$toastr.error('Debe introducir la descripción de su problema', 'Error')
        return false
      }
      this.form.case_id = this.caseId
      this.loading = true
      try {
        const response = await this.$axios.post('/report', this.form)
        this.$toastr.success('Su reporte se ha guardado correctamente', 'Éxito')
        console.log(response)
        this.clearForm()
        this.hideModal()
      } catch (error) {
        console.error(error)
        this.$toastr.error('Hubo un problema al guardar el reporte', 'Error')
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss">
#case-report {
  .pop-report {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background: orange;
    color: white;
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .full-text {
      display: none;
    }
  }
  .pop-report:hover {
    width: auto;
    padding: 0px 10px;
    .full-text {
      display: block;
    }
    .small-text {
      display: none;
    }
  }
  #form-report {
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.6); /* Black w/ opacity */
  }
  .report-popup {
    margin-right: auto;
    margin-left: auto;
    width: 410px;
    height: 405px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    padding: 28px 27px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .title {
    font-family: "Avenir";
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
      background-color: #EBEBEB;
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
      background-color: #FE9501;
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

  /* The Close Button */
  .cerrar {
    position: absolute;
    top: 15px;
    right: 35px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
  }

  .cerrar:hover,
  .cerrar:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
