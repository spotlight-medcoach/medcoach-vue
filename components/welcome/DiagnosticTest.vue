<template>
  <div class="content mt-0">
    <div class="row" v-if="test_error">
      <div class="col-sm-12 mt-5 mb-5 text-center">
        <h3 class="mb-2" style="font-weight: bold">
          Lo sentimos. No se pudo crear su examen.
        </h3>
      </div>
    </div>
    <div class="w-100 mb-5" v-else-if="loading">
      <loading-state message="Preparando examen" height="40vh" />
    </div>
    <div class="row justify-content-around" v-else>
      <div class="col-sm-5">
        <b-card
          id="diagnostic-card"
          class="mb-2 mr-2 text-center blue-theme"
          footer="INICIAR EXAMEN DIAGNÓSTICO"
          @click="createTest"
        >
          <h3 class="card-title" style="color: black">Examen diagnóstico I</h3>
          <span class="body">
            <ul>
              <li>Consta de 100 preguntas de opción múltiple</li>
              <li>Tiene un alto grado de complejidad y evaluación</li>
              <li>NO es formato ENARM</li>
              <li>Tendrás 3 horas para contestarlo</li>
            </ul>
          </span>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingState from '@/components/LoadingState.vue';
export default {
  name: 'DiagnosticTest',
  components: {
    LoadingState,
  },
  data () {
    return {
      loading: false,
      test_error: false,
    };
  },
  methods: {
    // Executed when @stepper-finished event is triggered
    createTest () {
      this.loading = true;
      let token = '';
      if (process.client) {
        token = localStorage.getItem('usertoken');
      }
      this.$axios
        .post(
          '/student/diagnostic',
          {
            first: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          console.log('Response:', response);
          this.$router.push({ path: '/diagnostic_test' });
        })
        .catch((err) => {
          console.log('Error:', err);
          this.test_error = true;
        });
    },
  },
};
</script>
