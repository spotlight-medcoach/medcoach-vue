<template>
<div>
  <div class="control-input d-flex">
    <p><b-icon-person></b-icon-person></p>
    <input type="text" v-model="user" placeholder="Usuario" />
  </div>
  <br>
   <div class="control-input d-flex">
    <p><b-icon-lock-fill></b-icon-lock-fill></p>
    <input v-model="password" type="password" placeholder="Contraseña" />
  </div>
  <br>
  <div align="center">
    <div class="divlogin" align="center">
      <b-overlay
        :show="busy"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block"
      >
        <button class="blogin" v-on:click="login()" type="button">Ingresar</button>
      </b-overlay>
    </div>
  </div>
  <br>
  <div align="center" @click="goToRecoverPassword">
    <p class="link">He olvidado la contraseña</p>
  </div>
</div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      user: '',
      password: '',
      busy: false
    }
  },
  methods: {
    login () {
      this.busy = true
      this.$axios
        .post('/students/login', {
          email: this.user,
          password: this.password // "12345678"
        })
        .then((res) => {
          const userData = res.data.payload
          if (userData.validated) {
            if (process.client) {
              localStorage.setItem('usertoken', res.data.token)
              this.$store.commit('setToken', res.data.token)
            }
            if (res.data.payload.finished_diagnostic_test) {
              this.$router.push({ path: '/dashboard' })
            } else {
              this.$router.push({ path: '/diagnostic_test' })
            }
          } else {
            this.$router.push({ name: 'welcome', query: { token: res.data.token } })
            this.busy = false
          }
        })
        .catch((err) => {
          const response = err.response
          this.$toastr.error(response.data.message, 'Error')
          this.busy = false
        })
    },
    goToRecoverPassword () {
      this.$store.commit('setLanding', 'recover_password')
    }
  }
}
</script>
