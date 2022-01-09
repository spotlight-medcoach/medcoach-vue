<template>
  <div id="student-sidebar">
    Aquí va el sidebar
  </div>
</template>
<style lang="scss">
  @import '@/assets/css/variables/_student_header_vars.scss';
  #student-sidebar {
    width: 78px;
    height: calc(100vh - #{$student-header-height});
    padding-left: 21px;
    padding-top: 50px;
    border-right: 1px solid #E8E8E1;
  }
</style>
