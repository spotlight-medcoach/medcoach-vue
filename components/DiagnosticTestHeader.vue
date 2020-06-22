<template>
<b-navbar toggleable="lg" type="dark" variant="info">
  <b-navbar-brand href="#">Test Diágnostico</b-navbar-brand>

  <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

  <b-collapse id="nav-collapse" is-nav>
    <b-navbar-nav>
      <b-nav-item>  Regresar </b-nav-item>
      <b-nav-item>Siguiente </b-nav-item>
    </b-navbar-nav>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item>Brillo</b-nav-item>
      <b-nav-item>Texto</b-nav-item>
    </b-navbar-nav>

  </b-collapse>
</b-navbar>
</template>

<script>
export default {
  name: 'diagnostic-test-header'
}
</script>
