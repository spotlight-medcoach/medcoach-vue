<template>
  <div>
    <div id="login" class="only-pc">
      <div class="mx-auto mt-auto">
        <img
          src="@/assets/images/logo.svg"
          class="logo"
        >
        <div class="card">
          <b-form>
            <div>
              <p>Bienvenido a</p>
              <p>MedCOACH</p>
              <p>Ingresa con tu email</p>
            </div>
            <div>
              <b-form-group
                id="email-grp"
                label="Email"
                label-for="email"
              >
                <b-form-input id="email" v-model="form.email" trim type="email"></b-form-input>
              </b-form-group>
              <b-form-group
                id="password-grp"
                label="Contraseña"
                label-for="password"
              >
                <b-form-input id="password" v-model="form.password" type="password" trim></b-form-input>
              </b-form-group>
            </div>
            <div>
              <b-button type="submit" variant="primary">Button</b-button>
              <p>Olvidé mi contraseña</p>
            </div>
          </b-form>
        </div>
        <div>
          <a href="#">¿Nuevo en MedCOACH?</a>
          <a href="#">Crea una cuenta</a>
        </div>
      </div>
      <div class="mx-auto mt-auto mb-40px">
        <a href="#">Aviso de Privacidad</a>
      </div>
    </div>
    <div class="only-small-device">
      <p v-if="inMaintenance">
        Lo sentimos, por el momento el sitio se encuentra en mantenimiento.
      </p>
      <p v-else>
        Este ingreso sólo es disponible por computadora.
      </p>
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
    flex-direction: column;

    .logo {
      width: 238px;
    }
  }
</style>
