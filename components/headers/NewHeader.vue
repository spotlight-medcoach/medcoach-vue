<template>
  <header id="new-header">
    <SandwichIcon
      style="height: 25px;"
      class="cursor-pointer mr-40px"
    />
    <div class="d-flex justify-content-between flex-grow-1 align-items-center">
      <img
        src="@/assets/images/logo.svg"
        class="logo"
      >
      <Searchbar />
      <Profile />
    </div>
  </header>
</template>
<script>
import SandwichIcon from '@/components/icons/Sandwich.vue'
import Searchbar from '@/components/headers/Searchbar.vue'
import Profile from '@/components/headers/Profile.vue'
export default {
  components: {
    SandwichIcon,
    Searchbar,
    Profile
  }
}
</script>
<style lang="scss">
  @import '@/assets/css/variables/_student_header_vars.scss';
  #new-header {
    height: $student-header-height;
    width: 100%;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.239922);
    padding: 18px 20px;
    padding-right: 50px;
    display: flex;
    align-items: center;
    .logo {
      width: 200px;
    }
  }
</style>
