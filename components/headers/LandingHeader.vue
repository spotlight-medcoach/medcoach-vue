<template>
<b-navbar toggleable="lg" type="white" variant="white" class="bottomBorder">
  <b-navbar-brand class="col-lg-1">
    <img src="@/assets/images/logo.svg" id="logo" align="left">
    <a :href="buy_path"><img src="@/assets/icons/cart.svg" width="40" height="40" class="mr-3 only-small-device cart"></a>
  </b-navbar-brand>
  <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  <b-collapse id="nav-collapse" is-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item class="item-border-right pr-4 mr-4 demo mt-2" :href="demo_path">
        <b>PROBAR DEMO</b>
      </b-nav-item>
      <b-nav-item :href="buy_path" class="mr-3">
        <img src="@/assets/icons/cart.svg" width="35" height="35" class="mr-3"> <b>COMPRAR</b>
      </b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</template>
<script>
export default {
  components: {
  },
  data () {
    return {
      user: '',
      password: '',
      busy: false,
      timeout: null,
      demo_path: '/demo',
      buy_path: '/welcome_payment'
    }
  },
  created () {
    const bubble = process.env.BASE_PATH_BUBBLE
    this.demo_path = bubble + this.demo_path
    this.buy_path = bubble + this.buy_path
  }
}
</script>
<style>
  .navbar-toggler {
    display: none;
  }
  #logo {
    width: 180px !important;
  }
  .navbar-brand {
    align-items: center;
    display: flex !important;
    justify-content: space-between;
    margin-right: 0px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  @media (min-width: 1100px) {
    .navbar-brand {
      align-self: unset;
      display: inline-block;
      justify-content: unset;
      margin-right: 1rem !important;
      padding-left: 15px !important;
      padding-right: 15px !important;
    }
    #logo {
      width: 200px !important;
    }
  }
</style>
