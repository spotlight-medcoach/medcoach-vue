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
  methods: {

  }
}
</script>

<style>
  body, html {
    height: 100%;
  }
  .bg {
    background-image: url("https://spotlightmed.s3-us-west-2.amazonaws.com/assets/background.png");
    /* Full height */
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
