<template>
<b-navbar
          v-if="showStudentHeader"
          toggleable="lg"
          type="white"
          variant="white"
          :sticky="true"
          class="bottomBorder">
  <b-navbar-brand style="margin-bottom: 0.1rem">
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
  <!-- EXAMEN PERSONALIZADO -->
  <nuxt-link to="/custom_test_config" tag="span">
    <div class="text-center pointer item-option" :class="{'active-option': isTest}">
      <img src="@/assets/icons/header/custom_test.svg" class="menu-item circulo">
      <div class="text-option">Examen</div>
    </div>
  </nuxt-link>
  <!-- Simuladores -->
  <!-- <nuxt-link to="/simulators" tag="span">
    <div class="text-center pointer item-option" :class="{'active-option': isTest}">
      <img src="@/assets/icons/header/custom_test.svg" class="menu-item circulo">
      <div class="text-option">Simuladores</div>
    </div>
  </nuxt-link> -->
  <!-- NAVBAR TOGGLE -->
  <b-collapse id="nav-collapse" is-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown>
        <template v-slot:button-content>
          <img src="@/assets/icons/sandwich.svg" width="30" height="30">
        </template>
        <b-dropdown-item @click="$router.push({ path: '/notifications' })">
          <img src="@/assets/icons/sandwich/notification_new.svg" width="20" style="margin-right: 12px;" v-if="alertNotifications">
          <img src="@/assets/icons/sandwich/notification.svg" width="20" style="margin-right: 12px;" v-else>
          Notificaciones
        </b-dropdown-item>
        <b-dropdown-item @click="$router.push({ path: '/settings' })">
          <img src="@/assets/icons/sandwich/settings.svg" width="20" style="margin-right: 12px;">
          Configuración
        </b-dropdown-item>
        <b-dropdown-item @click="logout">
          <img src="@/assets/icons/sandwich/log_in.svg" width="20" style="margin-right: 12px;">
          Cerrar Sesión
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

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
    },
    isTest () {
      return this.$route.name === 'custom_test_config' || this.$route.name === 'custom_test' || this.$route.name === 'custom_test_retro'
    },
    ...mapGetters({
      alertNotifications: 'notifications/alertNotifications'
    }),
    ...mapState({
      showStudentHeader: state => state.showStudentHeader
    })
  },
  methods: {
    logout () {
      this.$router.push({ path: '/' })
      setTimeout(() => {
        this.$store.dispatch('killSession')
        localStorage.clear()
      }, 500)
    }
  }
}
</script>

<style>
#logo {
  float: left;
  padding: 10px;
  width: 200px;
}
.menu-item {
  width: 35px;
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
  color: black;
  font-size :12px;
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
  left: -145px !important;
}
.menu {
  height: 60px;
}
.text-option {
  color: black;
  display: none;
  font-size: 13px;
  font-weight: bold;
  text-decoration: none !important;
}
.item-option{
  width: 85px;
}
.item-option:hover .text-option{
  display: block;
}
.circulo {
  background: #5F5F5F;
  border-radius: 50px;
}
.active-option .circulo {
  background: #FD9326;
}
</style>
