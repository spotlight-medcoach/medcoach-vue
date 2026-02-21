<template>
  <div style="width: 400px">
    <p class="text-center">
      Le enviaremos un email con un link para recuperar su contraseña
    </p>
    <div class="input-icon">
      <img src="/icons/email.png" alt="email">
      <input v-model="user" type="text" placeholder="Correo">
    </div>
    <div class="btn-login">
      <b-overlay
        :show="busy"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block"
      >
        <button @click="sendLink">
          <span>Enviar</span>
          <img src="/icons/white_hand.png" style="height: 28px">
        </button>
      </b-overlay>
    </div>
    <div class="text-center link pointer" @click="goToLogin">
      Regresar al login
    </div>
  </div>
</template>
<script>
export default {
  name: 'NewRecoveryPassword',
  data () {
    return {
      user: '',
      busy: false,
    };
  },
  methods: {
    sendLink () {
      if (this.user.trim() === '') {
        this.$toastr.error('No introdujó su email', 'Error');
        return false;
      }
      this.busy = true;
      this.$axios
        .post(
          `student/auth/reset-password?email=${encodeURIComponent(this.user)}`,
        )
        .then((response) => {
          this.$toastr.success(response.data.message, 'Éxito');
          this.user = '';
        })
        .catch((err) => {
          const response = err.response;
          this.$toastr.error(response.data.message, 'Error');
        })
        .finally(() => {
          this.busy = false;
        });
    },
    goToLogin () {
      this.$store.commit('setLanding', 'login');
    },
  },
};
</script>
