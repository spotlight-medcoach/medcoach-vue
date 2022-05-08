<template>
  <div>
    <!-- landing-header v-if="$route.name==='reset_password'"></landing-header> -->
    <welcome-header v-if="$route.name === 'welcome'" />
    <nuxt />
  </div>
</template>
<script>
// import LandingHeader from '@/components/headers/LandingHeader'
import WelcomeHeader from '@/components/headers/WelcomeHeader'

export default {
  components: {
    // LandingHeader,
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
