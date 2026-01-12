<template>
  <section
    id="creating"
    class="d-flex flex-column align-items-center justify-content-center"
  >
    <div class="loading-animation">
      <lottie-player
        ref="loading-animation"
        class="loading-animation"
        background="transparent"
        mode="normal"
        speed="1"
        loop
        autoplay
      />
    </div>
    <article class="text-center">
      <div class="heading-4">Estamos preparando tu plan de estudios</div>
      <div class="body-title-1 my-4 text-primary">
        Esto puede demorar unos minutos. No cierres la pestaña durante este
        proceso.
      </div>
      <p class="body-xlg my-3">
        Estamos interpretando tus respuestas y utilizando nuestros algoritmos
        para definir un plan personalizado para ti.
      </p>
      <b-progress
        :value="progress"
        :max="finishOn"
        variant="secondary"
        :striped="true"
      />
      <p class="body-xlg my-3">
        Nuestro algoritmo crea un plan de estudio progresivo e inteligente. Se
        adapta a tu avance diario y a tus días libres para redistribuir el
        contenido pendiente a lo largo de todo el plan. Evitando así
        sobrecargarte con información.
      </p>
    </article>
  </section>
</template>
<script>
export default {
  layout: 'diagnostic_test_layout',
  data () {
    return {
      progress: 0,
      timelapse: 500,
      finishOn: 60000,
      progressListener: undefined,
      pollingInterval: null,
      pollingTimeout: null,
      maxPollingTime: 300000, // 5 minutos máximo de polling
    };
  },
  mounted () {
    // Medidor de progreso visual
    this.progressListener = setInterval(
      function () {
        this.progress += this.timelapse;
        if (this.progress >= this.finishOn) {
          this.progress = this.finishOn; // No exceder el máximo
        }
      }.bind(this),
      this.timelapse,
    );

    // Timeout máximo para detener el polling
    this.pollingTimeout = setTimeout(() => {
      this.stopPolling();
      this.initializeDashboard();
    }, this.maxPollingTime);

    // Iniciar polling para verificar si el plan está listo
    this.startPolling();

    setTimeout(() => {
      // Espera para cargar lotti
      const successLottie = require('@/assets/lotties/loading_creating.json');
      this.$refs['loading-animation'].load(successLottie);
    }, 500);
  },
  beforeDestroy () {
    // Limpiar todos los intervalos y timeouts
    if (this.progressListener) {
      clearInterval(this.progressListener);
    }
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
    }
  },
  methods: {
    startPolling () {
      // Polling cada 1.5 segundos para verificar si el plan está listo
      this.pollingInterval = setInterval(async () => {
        try {
          const response = await this.$axios.get('/student/profile');
          // Verificar si la respuesta es 200 o 201 y si el plan está listo
          if (
            (response.status === 200 || response.status === 201) &&
            response.data
          ) {
            const student = response.data.student || response.data;
            // Si phase > 0, el plan está listo
            if (student && student.phase > 0) {
              this.stopPolling();
              this.initializeDashboard();
            }
          }
        } catch (error) {
          // No tratar errores como críticos, continuar polling
          // Solo loguear si no es un error de red común
          if (error.response && error.response.status !== 404) {
            console.error(
              'Error en polling:',
              error.response?.status || error.message,
            );
          }
          // Continuar polling incluso si hay error
        }
      }, 1500); // Polling cada 1.5 segundos
    },
    stopPolling () {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
      if (this.progressListener) {
        clearInterval(this.progressListener);
        this.progressListener = null;
      }
    },
    updateProfile () {
      this.$store.dispatch('initialize');
      const tokenUser = localStorage.getItem('usertoken');
      this.$router.push({ name: 'welcome', query: { token: tokenUser } });
    },
    initializeDashboard () {
      this.stopPolling();
      this.$store.dispatch('initialize').then(() => {
        this.$router.push({ path: '/dashboard' });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/variables/_student_main.scss';
#creating {
  background: #fff;
  article {
    max-width: 960px;
    position: relative;
    z-index: 1;
  }
  .loading-animation {
    height: 340px;
    width: 340px;
    text-align: center;
    lottie-player {
      height: 100%;
    }
  }
}
</style>
