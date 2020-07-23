<template>
  <b-navbar
            toggleable="lg"
            type="white"
            variant="white"
            fixed="top"
            class="bottomBorder"
            v-if="$route.name === 'welcome'">
    <b-navbar-brand href="#" class="col-lg-1">
      <nuxt-link to="/">
        <img src="@/assets/images/logo.svg" id="logo" align="left">
      </nuxt-link>
    </b-navbar-brand>
  </b-navbar>
</template>

<script>
export default {
  name: 'welcome-header'
}
</script>
