<template>
<b-navbar toggleable="lg" type="white" variant="white" class="bottomBorder">
  <b-navbar-brand class="col-lg-1">
    <img src="@/assets/images/logo.svg" id="logo" align="left">
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
