<template>
  <div id="index">
    <div class="bg imagen d-flex">
      <div class="bloque d-flex justify-content-center align-items-center">
        <img src="/logos.svg" class="logos">
      </div>
      <div class="bloque d-flex align-items-center">
        <div class="imagen isologo align-items-center">
          <login class="login-form only-pc" v-if="$store.state.landing === 'login'" />
          <recover-password class="login-form .d-sm-none .d-md-block" v-else-if="$store.state.landing === 'recover_password'" />
          <div class="login-form only-small-device">
            <p>Para utilizar a la plataforma MedCoach es necesario ingresar desde un dispositivo de escritorio o laptop con resolución mínima de 1100px</p>
          </div>
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
.only-pc {
  display: none;
}
.only-small-device {
  display: block;
}
@media (min-width: 1100px) {
  .only-pc {
    display: block;
  }
  .only-small-device {
    display: none;
  }
}
</style>
