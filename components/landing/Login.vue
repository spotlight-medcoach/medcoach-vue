<template>
  <div id="login">
    <div class="mx-auto mt-auto">
      <img
        src="@/assets/images/logo.svg"
        class="logo d-block mx-auto mb-40px"
      >
      <div class="card login-card mb-20px">
        <b-form>
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
              <b-form-input
                id="email"
                v-model="form.email"
                trim
                type="email"
              />
            </b-form-group>
            <b-form-group
              id="password-grp"
              label="Contraseña"
              label-for="password"
            >
              <b-form-input
                id="password"
                v-model="form.password"
                type="password"
                trim
              />
            </b-form-group>
          </div>
          <div>
            <b-button
              type="submit"
              variant="primary"
              class="d-block w-100 mb-16px"
            >
              Iniciar sesión
            </b-button>
            <p
              class="link text-center"
              @click="$store.commit('landing/setScreen', 'recovery-password')"
            >
              Olvidé mi contraseña
            </p>
          </div>
        </b-form>
      </div>
      <div class="d-flex justify-content-around px-4">
        <span>¿Nuevo en MedCOACH?</span>
        <a  href="#">Crea una cuenta</a>
      </div>
    </div>
    <div class="mx-auto mt-auto mb-40px">
      <a href="#">AVISO DE PRIVACIDAD</a>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'index',
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  }
}
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
