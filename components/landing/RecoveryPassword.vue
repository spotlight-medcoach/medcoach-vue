<template>
  <div id="recovery-password">
    <div class="mx-auto mt-auto mb-70px">
      <img
        src="@/assets/images/logo.svg"
        class="logo d-block mx-auto mb-70px"
      >
      <div class="card recovery-password-card mb-20px">
        <validation-observer ref="formValidation">
          <b-form @submit.prevent="recoveryPassword">
            <div class="text-center mb-40px">
              <p class="title-lg">Correo De Recuperación</p>
              <p class="title-sm">Ingresa tu email de recuperación</p>
            </div>
            <div class="mb-48px">
              <b-form-group
                id="email-grp"
                label="Email"
                label-for="email"
                class="mb-24px"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="email"
                    v-model="form.email"
                    trim
                    type="email"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>
            <div>
              <b-overlay :show="recoveryLoading" spinner-small>
                <b-button
                  type="submit"
                  variant="primary"
                  class="d-block w-100 mb-16px"
                >
                  Enviar correo
                </b-button>
              </b-overlay>
            </div>
          </b-form>
        </validation-observer>
      </div>
    </div>
    <div class="text-center link link-primary">
      <p class="link" @click="$store.commit('landing/setScreen', 'login')">Cancelar</p>
    </div>
    <div class="mx-auto mt-auto mb-40px">
      <a style="color: #7D7A7A" href="#">AVISO DE PRIVACIDAD</a>
    </div>
  </div>
</template>
<script>
import { required, email } from '@/assets/utils/validations.js'
export default {
  data () {
    return {
      form: {
        email: ''
      },
      required,
      email,
      recoveryLoading: false
    }
  },
  methods: {
    async recoveryPassword () {
      try {
        if (!this.recoveryLoading) {
          this.recoveryLoading = true
          const success = await this.$refs.formValidation.validate()
          if (success) {
            const { data } = await this.$axios.post(`student/resetpassword?email=${this.form.email}`)
            this.$toastr.success(data.message, 'Éxito')
            this.form.email = ''
            this.$store.commit('landing/setScreen', 'login')
          } else {
            this.$toastr.error('Hay campos incorrectos', 'Error')
          }
          this.recoveryLoading = false
        }
      } catch (error) {
        console.error(error)
        this.$toastr.error('Lo sentimos. Hubo un error', 'Error')
      }
    }
  }
}
</script>
<style lang="scss">
  #recovery-password {
    height: 100vh;
    width: 100vw;
    display: flex;
    overflow-x: hidden;
    flex-direction: column;

    .logo {
      width: 238px;
    }

    .recovery-password-card {
      width: 511px;
    }
  }
</style>
