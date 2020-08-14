<template>
<div id="recover-password">
  <p>Le enviaremos un email con un link para recuperar su contraseña</p>
  <div class="control-input d-flex">
    <p><b-icon-envelope></b-icon-envelope></p>
    <input type="text" v-model="user" placeholder="Email" />
  </div>
  <div align="center" class="my-3">
    <div class="divlogin" align="center">
      <b-overlay
        :show="busy"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block"
      >
        <button class="blogin" v-on:click="sendLink()" type="button">Enviar</button>
      </b-overlay>
    </div>
  </div>
  <div align="center">
    <p class="link" @click="goToLogin">Regresar al Login</p>
  </div>
</div>
</template>
<script>
export default {
  name: 'recover-password',
  data () {
    return {
      user: '',
      busy: false
    }
  },
  methods: {
    sendLink () {
      if (this.user.trim() === '') {
        this.$toastr.error('No introdujó su email', 'Error')
        return false
      }
      this.busy = true
      this.$axios
        .post(`student/resetpassword?email=${this.user}`)
        .then((response) => {
          this.$toastr.success(response.data.message, 'Éxito')
          this.user = ''
        })
        .catch((err) => {
          const response = err.response
          this.$toastr.error(response.data.message, 'Error')
        })
        .finally(() => {
          this.busy = false
        })
    },
    goToLogin () {
      this.$store.commit('setLanding', 'login')
    }
  }
}
</script>
