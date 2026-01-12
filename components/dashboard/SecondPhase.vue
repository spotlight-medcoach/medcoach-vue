<template>
  <div class="pb-5">
    <div class="mt-5 d-flex justify-content-around">
      <div class="text-center">
        <h3 class="mb-4" style="font-weight: bolder">¡Felicidades!</h3>
        <h5 class="mb-4">Entraste a la segunda fase de tu plan de estudios.</h5>
        <p class="mb-4">
          Haz tu examen diagnóstico para organizar el contenido dependiendo de
          tus fortalezas.
        </p>
        <b-button
          variant="primary"
          v-if="!$store.state.welcome.plan_selected"
          @click="goToSecondStage"
          >Hacer examen diagnóstico</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'second-phase',
  methods: {
    goToSecondStage () {
      this.$store.dispatch('http_request/initHttpRequest', 'Preparando examen');
      this.$axios
        .post('/student/diagnostic', {
          first: false,
        })
        .then(() => {
          this.$router.push({ path: '/diagnostic_test' });
        })
        .catch(() => {
          this.$store.dispatch('http_request/errorHttp');
        });
    },
  },
};
</script>
