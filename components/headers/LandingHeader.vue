<template>
<b-navbar toggleable="lg" type="white" variant="white" class="bottomBorder">
  <b-navbar-brand class="col-lg-1">
    <img src="@/assets/images/logo.svg" id="logo" align="left">
  </b-navbar-brand>
  <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  <b-collapse id="nav-collapse" is-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item class="item-border-right pr-4 mr-4 demo mt-2" href="https://app.spotlightmed.com/version-test/demo_dashboard">
        <b>PROBAR DEMO</b>
      </b-nav-item>
      <b-nav-item href="https://app.spotlightmed.com/version-test/welcome_payment" class="mr-3">
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
      timeout: null
    }
  }
}
</script>
