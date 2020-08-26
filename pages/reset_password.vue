<template>
<div id="reset-password">
  <div class="bg imagen d-flex justify-content-center align-items-center">
    <div class="login-form">
      <div class="control-input d-flex mt-3">
        <input v-model="password" type="password" placeholder="Ingresa una nueva contraseña" />
      </div>
      <br>
       <div class="control-input d-flex">
        <input v-model="confirm_password" type="password" placeholder="Confirma la contraseña" />
      </div>
      <br>
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
            <button class="blogin" v-on:click="resetPassword()" type="button">Cambiar contraseña</button>
          </b-overlay>
        </div>
      </div>
      <div align="center">
        <p class="link" @click="$router.push('/')">Regresar al Login</p>
      </div>
    </div>
  </div>
  <landing-footer></landing-footer>
</div>
</template>
<script>
import LandingFooter from '@/components/LandingFooter'
export default {
  components: {
    LandingFooter
  },
  layout: 'index',
  data () {
    return {
      password: '',
      confirm_password: '',
      busy: false,
      token: ''
    }
  },
  created () {
    if (this.$route.query.token) {
      this.token = this.$route.query.token
    } else {
      this.$router.push({ path: '/', query: { invalid_token: 'Token inválido' } })
    }
  },
  methods: {
    resetPassword () {
      if (this.validatePasswords()) {
        const params = {
          token: this.token,
          password: this.password,
          password_confirm: this.confirm_password
        }
        this.busy = true
        this.$axios.put('/student/resetpassword', params)
          .then((response) => {
            this.$toastr.success(response.data.message, 'Éxito')
            this.$router.push('/')
          })
          .catch((error) => {
            const response = error.response
            this.$toastr.error(response.data.message, 'Error')
          })
          .finally(() => {
            this.busy = false
          })
      }
    },
    validatePasswords () {
      const password = this.password.trim()
      const confirmPassword = this.confirm_password.trim()
      if (password === '') {
        this.$toastr.error('Debe ingresar su nueva contraseña', 'Error')
        return false
      }
      if (confirmPassword === '') {
        this.$toastr.error('Debe confirmar su nueva contraseña', 'Error')
        return false
      }
      if (password !== confirmPassword) {
        this.$toastr.error('Las contraseñas no coinciden', 'Error')
        return false
      }
      return true
    }
  }
}
</script>
<style lang="less">
  .bg {
    background-image: url("/background.png");
    width: 100%;
  }
  .imagen {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  #reset-password {
    .login-form {
      margin: 0px !important;
      width: 400px;
      height: 250px;
      .control-input input {
        width: 95% !important;
        margin-left: 5% !important;
      }
    }
    .divlogin {
      width: 50% !important;
    }
  }
</style>
