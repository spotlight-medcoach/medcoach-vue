<template>
  <div id="login">
    <div class="mx-auto mt-auto">
      <img
        src="@/assets/images/logo.svg"
        class="logo d-block mx-auto mb-40px"
      />
      <div class="card login-card mb-20px">
        <validation-observer ref="loginValidation">
          <b-form @submit.prevent="login">
            <div class="text-center mb-40px">
              <p class="login-title">Bienvenido A</p>
              <p class="login-title mb-10px">MedCOACH</p>
              <p class="login-subtitle">Ingresa con tu email</p>
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
              <b-form-group
                id="password-grp"
                label="Contraseña"
                label-for="password"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Contraseña"
                  rules="required"
                >
                  <b-form-input
                    id="password"
                    v-model="form.password"
                    type="password"
                    trim
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </div>
            <div>
              <b-overlay :show="loginLoading" spinner-small>
                <b-button
                  type="submit"
                  variant="primary"
                  class="d-block w-100 mb-16px"
                >
                  Iniciar sesión
                </b-button>
              </b-overlay>
              <p
                class="link link-primary text-center"
                @click="$store.commit('landing/setScreen', 'recovery-password')"
              >
                Olvidé mi contraseña
              </p>
            </div>
          </b-form>
        </validation-observer>
      </div>
      <div class="d-flex justify-content-around px-4">
        <span>¿Nuevo en MedCOACH?</span>
        <router-link to="/sign_up">Crea una cuenta</router-link>
      </div>
    </div>
    <div class="mx-auto mt-auto mb-40px">
      <a
        style="color: #7d7a7a"
        href="https://spotlightmed.com/terminos-y-condiciones/"
        >AVISO DE PRIVACIDAD</a
      >
    </div>
    <validate-phone-modal
      v-if="loaded"
      :email="form.email"
      @onPhoneValid="login"
    />
  </div>
</template>
<script>
import { required, email } from '@/assets/utils/validations.js';
export default {
  components: {
    ValidatePhoneModal: () => import('@/components/ValidatePhoneModal.vue'),
  },
  layout: 'index',
  data () {
    return {
      form: {
        email: '',
        password: '',
      },
      required,
      email,
      loginLoading: false,
      loaded: false,
    };
  },
  mounted () {
    this.loaded = true;
    this.$root.$emit('bv::show::modal', 'validate-phone-modal');
  },
  methods: {
    async login () {
      if (!this.loginLoading) {
        this.loginLoading = true;
        const success = await this.$refs.loginValidation.validate();
        if (success) {
          try {
            const { data } = await this.$axios.post(
              '/student/auth/login',
              this.form,
            );
            const student = data.payload;
            if (student) {
              this.$store.commit('setFreeTrial', student.is_free_trial);
              if (process.client) {
                localStorage.setItem('usertoken', data.token);
                this.$store.commit('setToken', data.token);
              }
              if (student.finished_diagnostic_test || student.is_free_trial) {
                this.$router.push({ path: '/dashboard' });
              } else {
                this.$router.push({ path: '/diagnostic_test' });
              }
            } else {
              this.$toastr.error('Verifica tus claves de acceso', 'Error');
            }
          } catch (error) {
            if (error.response) {
              this.$toastr.error(error.response.data.message, 'Error');
            }
          }
        } else {
          this.$toastr.error('Hay campos incorrectos', 'Error');
        }
        this.loginLoading = false;
      }
    },
  },
};
</script>
<style lang="scss">
#login {
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow-x: hidden;
  flex-direction: column;

  .logo {
    width: 238px;
  }

  .login-card {
    width: 508px;
  }

  .login-title {
    font-style: normal;
    font-weight: 750;
    font-size: 32px;
    line-height: 36px;
  }

  .login-subtitle {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 36px;
  }
}
</style>
