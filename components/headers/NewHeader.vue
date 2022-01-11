<template>
  <header id="new-header">
    <span
      v-if="sidebarActive"
      @click="$store.commit('sidebar/setSidebarActive', false)"
      class="cursor-pointer"
      style="margin-right: 51px; margin-left: 10px;"
    >
      <ExpandIcon
        style="height: 25px;"
      />
    </span>
    <span
      v-else
      @click="$store.commit('sidebar/setSidebarActive', true)"
      class="cursor-pointer mr-40px"
    >
      <SandwichIcon
        style="height: 25px;"
      />
    </span>
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
import { mapGetters } from 'vuex'
import SandwichIcon from '@/components/icons/Sandwichicon.vue'
import ExpandIcon from '@/components/icons/ExpandIcon.vue'
import Searchbar from '@/components/headers/Searchbar.vue'
import Profile from '@/components/headers/Profile.vue'
export default {
  components: {
    SandwichIcon,
    Searchbar,
    Profile,
    ExpandIcon
  },
  computed: {
    ...mapGetters({
      sidebarActive: 'sidebar/sidebarActive'
    })
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
