<template>
  <div>
    <student-header v-if="$route.name!=='manual' && $route.name!=='diagnostic_test' && $route.name!=='simulators' && $route.name!=='introduction_simulator' && $route.name!=='simulator_block1' && $route.name!=='test_simulator' && $route.name!=='simulator_break'"></student-header>
    <nuxt class="only-pc" />
    <div class="only-small-device mb-5">
      <p class="m-5 text-center">
        Para utilizar a la plataforma MedCoach es necesario ingresar desde un dispositivo de escritorio o laptop con resolución mínima de 1100px
      </p>
    </div>
  </div>
</template>
<script>
import StudentHeader from '@/components/headers/StudentHeader'
export default {
  components: {
    StudentHeader
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
