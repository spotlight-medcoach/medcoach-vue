<template>
  <div id="index">
    <div class="bg imagen bg-main">
      <div class="bloque d-flex justify-content-center align-items-center">
        <img src="/logos.svg" class="logos">
      </div>
      <div class="bloque d-flex align-items-center">
        <div class="imagen isologo align-items-center">
          <login class="login-form" v-if="$store.state.landing === 'login'" />
          <recover-password class="login-form .d-sm-none .d-md-block" v-else-if="$store.state.landing === 'recover_password'" />
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
          Este ingreso sólo es disponible por computadora.
        </div>
      </div>
    </div>
    <landing-footer></landing-footer>
  </div>
</template>

<script>
import LandingFooter from '@/components/LandingFooter'
import Login from '@/components/landing/Login'
import RecoverPassword from '@/components/landing/RecoverPassword'

export default {
  name: 'Home',
  layout: 'index',
  components: {
    LandingFooter,
    Login,
    RecoverPassword
  },
  created () {
    if (this.$route.query.invalid_token) {
      this.$toastr.error(this.$route.query.invalid_token, 'Error')
      this.$router.replace({ query: null })
    }
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
@media (min-width: 1100px) {
  .bg-main{
    display: flex !important;
  }
}
</style>
