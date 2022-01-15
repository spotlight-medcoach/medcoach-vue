<template>
  <div id="reset-password">
    <div class="mx-auto mt-auto mb-20px">
      <img
        src="@/assets/images/logo.svg"
        class="logo d-block mx-auto mb-20px"
      >
      <div class="card reset-password-card mb-20px">
        <validation-observer ref="formValidation">
          <b-form @submit.prevent="resetPassword">
            <div class="text-center mb-40px">
              <p class="title-lg">Cambiar Contraseña</p>
              <p class="title-sm">Cambia y confirma tu contraseña</p>
            </div>
            <div class="mb-48px">
              <b-form-group
                id="password-grp"
                label="Contraseña"
                label-for="password"
                class="mb-24px"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Contraseña"
                  vid="Password"
                  rules="required|min:8"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    trim
                    type="password"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-form-group
                id="confirm_password-grp"
                label="Confirma contraseña"
                label-for="confirm_password"
                class="mb-24px"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Confirma contraseña"
                  rules="required|confirmed:Password"
                >
                  <b-form-input
                    id="confirm_password"
                    v-model="confirm_password"
                    trim
                    type="password"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>
            <div>
              <b-overlay :show="resetLoading" spinner-small>
                <b-button
                  type="submit"
                  variant="primary"
                  class="d-block w-100 mb-16px"
                >
                  Cambiar contraseña
                </b-button>
              </b-overlay>
            </div>
          </b-form>
        </validation-observer>
      </div>
    </div>
    <div class="text-center">
      <a class="link link-primary" href="/">Cancelar</a>
    </div>
    <div class="mx-auto mt-auto mb-40px">
      <a style="color: #7D7A7A" href="#">AVISO DE PRIVACIDAD</a>
    </div>
  </div>
</template>
<script>
import { required } from '@/assets/utils/validations.js'
export default {
  layout: 'index',
  data () {
    return {
      password: '',
      confirm_password: '',
      resetLoading: false,
      token: '',
      required
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
    async resetPassword () {
      try {
        if (!this.resetLoading) {
          this.resetLoading = true
          const success = await this.$refs.formValidation.validate()
          if (success) {
            const params = {
              token: this.token,
              password: this.password,
              password_confirm: this.confirm_password
            }
            const { data } = await this.$axios.put('/student/resetpassword', params)
            this.$toastr.success(data.message, 'Éxito')
            this.$router.push('/')
          } else {
            this.$toastr.error('Hay campos incorrectos', 'Error')
          }
          this.resetLoading = false
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
  #reset-password {
    height: 100vh;
    width: 100vw;
    display: flex;
    overflow-x: hidden;
    flex-direction: column;

    .logo {
      width: 238px;
    }

    .reset-password-card {
      width: 511px;
    }
  }
</style>
