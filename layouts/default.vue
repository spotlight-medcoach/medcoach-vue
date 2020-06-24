<template>
  <div>
    <landing-header v-if="$route.name==='index'"></landing-header>
    <!--<diagnostic-test-header v-else-if="$route.name === 'diagnostic-test'"></diagnostic-test-header>-->
    <student-header v-else-if="$route.name!=='manual' && $route.name!=='diagnostic_test'"></student-header>
    <nuxt />
  </div>
</template>
<script>
import LandingHeader from '@/components/LandingHeader'
import StudentHeader from '@/components/StudentHeader'

export default {
  components: {
    LandingHeader,
    StudentHeader
  },
  mounted () {
    console.log('Route name:', this.$route.name)
  }
}
</script>

<style>
  @font-face {
    font-family: Avenir;
    src: url("https://spotlightmed.s3-us-west-2.amazonaws.com/fonts/AvenirLTStd-Book.otf");
  }

  html {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
