<template>
  <div id="index">
    <div class="bg imagen bg-main">
      <div class="bloque d-flex justify-content-center align-items-center">
        <img src="/logos.svg" class="logos">
      </div>
      <div class="bloque d-flex align-items-center">
        <div v-if="inMaintenance" class="login-form text-center">
          <p>Lo sentimos, por el momento el sitio se encuentra en mantenimiento.</p>
        </div>
        <div v-else class="imagen isologo align-items-center">
          <login v-if="$store.state.landing === 'login'" class="login-form" />
          <recover-password v-else-if="$store.state.landing === 'recover_password'" class="login-form .d-sm-none .d-md-block" />
        </div>
      </div>
    </div>
    <div class="bg imagen only-small-device bg-small">
      <div class="d-flex justify-content-center align-items-end" style="height: 50%">
        <img src="/logos.svg" class="logos" style="width: 85%">
      </div>
      <div class="d-flex justify-content-center align-items-center" style="height: 50%">
        <img src="/isologo.png" class="logos sm-isologo">
        <div class="login-form">
          <p v-if="inMaintenance">
            Lo sentimos, por el momento el sitio se encuentra en mantenimiento.
          </p>
          <p v-else>
            Este ingreso sólo es disponible por computadora.
          </p>
        </div>
      </div>
    </div>
    <landing-footer />
  </div>
</template>

<script>
import LandingFooter from '@/components/LandingFooter'
import Login from '@/components/landing/Login'
import RecoverPassword from '@/components/landing/RecoverPassword'

export default {
  name: 'Home',
  components: {
    LandingFooter,
    Login,
    RecoverPassword
  },
  layout: 'index',
  data () {
    return {
      inMaintenance: false
    }
  },
  created () {
    if (this.$route.query.invalid_token) {
      this.$toastr.error(this.$route.query.invalid_token, 'Error')
      this.$router.replace({ query: null })
    }
    this.inMaintenance = (process.env.IN_MAINTENANCE === 'true')
  }
}
</script>
<style>
.bg-main {
  display: none !important;
}
.bg-small {
  height: 70vh;
  overflow: hidden;
  position: relative;
}
.bg-small .login-form {
  z-index: 10;
  padding: 30px;
  text-align: center;
}
.sm-isologo {
  width: 60%;
  position: absolute;
  left: 60vw;
}
@media (min-width: 1000px) {
  .bg-main{
    display: flex !important;
  }
}
</style>
