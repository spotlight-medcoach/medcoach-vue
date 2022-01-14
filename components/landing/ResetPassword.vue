<template>
  <div id="recovery-password">
    <div class="mx-auto mt-auto mb-20px">
      <img
        src="@/assets/images/logo.svg"
        class="logo d-block mx-auto mb-20px"
      >
      <div class="card recovery-password-card mb-20px">
        <b-form>
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
              <b-form-input
                id="password"
                v-model="form.password"
                trim
                type="password"
              />
            </b-form-group>
            <b-form-group
              id="confirm_password-grp"
              label="Confirma contraseña"
              label-for="confirm_password"
              class="mb-24px"
            >
              <b-form-input
                id="confirm_password"
                v-model="form.confirm_password"
                trim
                type="password"
              />
            </b-form-group>
          </div>
          <div>
            <b-button
              type="submit"
              variant="primary"
              class="d-block w-100 mb-16px"
            >
              Cambiar contraseña
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
        password: '',
        confirm_password: ''
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
