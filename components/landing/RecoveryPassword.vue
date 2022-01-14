<template>
  <div id="recovery-password">
    <div class="mx-auto mt-auto mb-70px">
      <img
        src="@/assets/images/logo.svg"
        class="logo d-block mx-auto mb-70px"
      >
      <div class="card recovery-password-card mb-20px">
        <b-form>
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
              <b-form-input
                id="email"
                v-model="form.email"
                trim
                type="email"
              />
            </b-form-group>
          </div>
          <div>
            <b-button
              type="submit"
              variant="primary"
              class="d-block w-100 mb-16px"
              @click="$store.commit('landing/setScreen', 'reset-password')"
            >
              Enviar correo
            </b-button>
          </div>
        </b-form>
      </div>
    </div>
    <div class="text-center">
      <p class="link" @click="$store.commit('landing/setScreen', 'login')">Cancelar</p>
    </div>
    <div class="mx-auto mt-auto mb-40px">
      <a href="#">AVISO DE PRIVACIDAD</a>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        email: ''
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
