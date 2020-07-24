<template>
<b-navbar
          toggleable="lg"
          type="white"
          variant="white"
          :sticky="true"
          class="bottomBorder">
  <b-navbar-brand class="mr-5">
    <img src="@/assets/images/logo.svg" id="logo" align="left">
  </b-navbar-brand>
  <!-- HOME  -->
  <nuxt-link to="/dashboard" tag="span">
    <div class="text-center pointer item-option" :class="{'active-option': isDashboard}">
      <img src="@/assets/icons/home_logo_on.svg" class="menu-item" v-if="isDashboard">
      <img src="@/assets/icons/home_logo_off.svg" class="menu-item" v-else>
      <div class="text-option">Home</div>
    </div>
  </nuxt-link>
  <!-- CALENDARIO  -->
  <nuxt-link to="/calendar" tag="span">
    <div class="text-center pointer item-option" :class="{'active-option': isCalendar}">
      <img src="@/assets/icons/calendario_logo_on.svg" class="menu-item" v-if="isCalendar">
      <img src="@/assets/icons/calendario_logo_off.svg" class="menu-item" v-else>
      <div class="text-option">Calendario</div>
    </div>
  </nuxt-link>
  <!-- MANUALES  -->
  <nuxt-link to="/manuals" tag="span">
    <div class="text-center pointer item-option" :class="{'active-option': isManuals}">
      <img src="@/assets/icons/manuales_logo_on.svg" class="menu-item" v-if="isManuals">
      <img src="@/assets/icons/manuales_logo_off.svg" class="menu-item" v-else>
      <div class="text-option">Manuales</div>
    </div>
  </nuxt-link>
  <!-- NOTAS -->
  <nuxt-link to="/notes" tag="span">
    <div class="text-center pointer item-option" :class="{'active-option': isNotes}">
      <img src="@/assets/icons/notas_logo_on.svg" class="menu-item" v-if="isNotes">
      <img src="@/assets/icons/notas_logo_off.svg" class="menu-item" v-else>
      <div class="text-option">Notas</div>
    </div>
  </nuxt-link>
  <!-- NAVBAR TOGGLE -->
  <b-collapse id="nav-collapse" is-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown>
        <template v-slot:button-content>
          <img src="@/assets/icons/sandwich.svg" width="30" height="30">
        </template>
        <b-dropdown-item href="#">Notificaciones</b-dropdown-item>
        <b-dropdown-item href="/settings">Configuración</b-dropdown-item>
        <b-dropdown-item @click="logout">Cerrar Sesión</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</template>

<script>
export default {
  name: 'student-header',
  computed: {
    isDashboard () {
      return this.$route.name === 'dashboard'
    },
    isCalendar () {
      return this.$route.name === 'calendar'
    },
    isManuals () {
      return this.$route.name === 'manuals' || this.$route.name === 'manual'
    },
    isNotes () {
      return this.$route.name === 'notes' || this.$route.name === 'review'
    }
  },
  methods: {
    logout () {
      localStorage.clear()
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
#logo {
  float: left;
  width: 200px;
  padding: 10px;
}
.menu-item {
  width: 45px;
}
.bottomBorder{
  border-bottom:1px solid;
}
.maincontainer{
  position:fixed;
  z-index:0;
}
.selected{
  position: fixed;
  top:1px;
}
.textH{
  font-size :12px;
  color: black;
}
.nav-link {
  color: black;
}
.item-border-right {
  border-right: 1px solid #000 !important;
}
.item-border-right > .nav-link {
  padding-top: 0.75em;
}
.dropdown-toggle {
  color: white;
}
.dropdown-toggle:hover {
  color: white !important;
}
.dropdown-menu {
  left: -120px !important;
}
.menu {
  height: 60px;
}
.text-option {
  color: black;
  font-weight: bold;
  text-decoration: none !important;
  display: none;
}
.item-option{
  width: 100px;
}
.active-option .text-option{
  display: block;
}
.item-option:hover .text-option{
  display: block;
}
</style>
