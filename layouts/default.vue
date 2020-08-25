<template>
  <div>
    <landing-header v-if="$route.name==='index' || $route.name==='reset_password'"></landing-header>
    <welcome-header v-else-if="$route.name === 'welcome'" />
    <student-header v-else-if="$route.name!=='manual' && $route.name!=='diagnostic_test' && $route.name!=='simulators' && $route.name!=='introduction_simulator' && $route.name!=='simulator_block1' && $route.name!=='test_simulator' && $route.name!=='simulator_break'"></student-header>
    <nuxt />
  </div>
</template>
<script>
import LandingHeader from '@/components/headers/LandingHeader'
import StudentHeader from '@/components/headers/StudentHeader'
import WelcomeHeader from '@/components/headers/WelcomeHeader'

export default {
  components: {
    LandingHeader,
    StudentHeader,
    WelcomeHeader
  },
  mounted () {
    document.onkeyup = this.onKeyUp
    console.log('Route name:', this.$route.name)
  },
  methods: {
    onKeyUp (e) {
      const keyCode = e.keyCode ? e.keyCode : e.which
      if (keyCode === 44) {
        e.preventDefault()
        this.stopPrntScr()
        return false
      }
    },
    stopPrntScr () {
      const inpFld = document.createElement('input')
      inpFld.setAttribute('value', '.')
      inpFld.setAttribute('width', '0')
      inpFld.style.height = '0px'
      inpFld.style.width = '0px'
      inpFld.style.border = '0px'
      document.body.appendChild(inpFld)
      inpFld.select()
      document.execCommand('copy')
      inpFld.remove(inpFld)
    }
  }
}
</script>
