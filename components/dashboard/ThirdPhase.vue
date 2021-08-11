<template>
<div class="pb-5">
  <div class="mt-5 d-flex justify-content-around">
    <div class="text-center">
      <h3 class="mb-4" style="font-weight: bolder">¡Comienza tu último repaso!</h3>
      <h5 class="mb-4">Este es el repaso general de todos los temas ya vistos.</h5>
      <p class="mb-4">En esta etapa repasarás los temas más importantes para el ENARM</p>
      <b-overlay
        :show="loading"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block"
      >
        <b-button variant="primary" @click="goToThirdStage">
          Presiona el botón para comenzar tu fase 3
        </b-button>
      </b-overlay>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'third-phase',
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async goToThirdStage () {
      this.loading = true
      try {
        await this.$axios.post('/student/thirdphase')
        window.location.reload()
      } catch (error) {
        console.error(error)
        this.$toastr.error('Lo sentimos ocurrió un error', 'Error')
      }
      this.loading = false
    }
  }
}
</script>
