<template>
  <div id="index">
    <div class="bg imagen d-flex">
      <div class="bloque d-flex justify-content-center align-items-center">
        <img src="/logos.svg" class="logos">
      </div>
      <div class="bloque d-flex align-items-center">
        <div class="imagen isologo align-items-center">
          <login class="login-form" v-if="$store.state.landing === 'login'" />
          <recover-password class="login-form" v-else-if="$store.state.landing === 'recover_password'" />
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
