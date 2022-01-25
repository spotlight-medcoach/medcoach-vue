<template>
  <div>
    <student-header v-if="validateLoadStudentHeader($route.name)"></student-header>
    <nuxt class="only-pc" />
    <div class="only-small-device mb-5">
      <p class="m-5 text-center">
        Para utilizar a la plataforma MedCoach es necesario ingresar desde un dispositivo de escritorio o laptop con resolución mínima de 900px
      </p>
    </div>
  </div>
</template>
<script>
import StudentHeader from '@/components/headers/StudentHeader'
const pathsDisabledForStudentHeader = [
  'manual',
  'manual',
  'manuals',
  'diagnostic_test',
  'simulators',
  'introduction_simulator',
  'simulator_block1',
  'test_simulator',
  'simulator_break'
]
export default {
  components: {
    StudentHeader
  },
  mounted () {
    if (!process.env.DEVELOP) {
      document.onkeyup = this.onKeyUp
      document.addEventListener('contextmenu', event => event.preventDefault())
    }
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
    },
    validateLoadStudentHeader (routerPath) {
      const isDisallowed = routerPath in pathsDisabledForStudentHeader
      return !isDisallowed
    }
  }
}
</script>
