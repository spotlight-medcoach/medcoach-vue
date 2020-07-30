<template>
  <div>
    <div class="bg"></div>
    <landing-footer></landing-footer>
  </div>
</template>

<script>
import LandingFooter from '@/components/LandingFooter'

export default {
  name: 'Home',
  components: {
    LandingFooter
  },
  data () {
    return {
      data: {
        email: '',
        password: ''
      }
    }
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
  .bg {
    background-image: url("https://spotlightmed.s3-us-west-2.amazonaws.com/assets/background.png");
    /* Full height */
    height: 94vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
