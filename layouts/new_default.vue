<template>
  <div>
    <NewHeader />
    <div class="only-pc d-flex">
      <StudentSidebar />
      <nuxt class="main-content" />
    </div>
    <div class="only-small-device mb-5">
      <p class="m-5 text-center">
        Para utilizar a la plataforma MedCoach es necesario ingresar desde un dispositivo de escritorio o laptop con resolución mínima de 900px
      </p>
    </div>
  </div>
</template>
<script>
import NewHeader from '@/components/headers/NewHeader'
import StudentSidebar from '@/components/sidebars/StudentSidebar'
export default {
  components: {
    NewHeader,
    StudentSidebar
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
    }
  }
}
</script>
<style lang="scss">
  @import '@/assets/css/variables/_student_header_vars.scss';
  .main-content {
    flex-grow: 1;
    overflow-y: auto;
    height: calc(100vh - #{$student-header-height});
  }
</style>
