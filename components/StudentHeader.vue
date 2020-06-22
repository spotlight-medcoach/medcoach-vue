Vue.component('header', {
<template>
<div>
<div class="maincontainer"><br/></div>
  <b-navbar toggleable="lg" type="white" variant="white" fixed="top" class="bottomBorder">
    <b-navbar-brand href="#" class="col-lg-1">
      <router-link to="/">
        <img src="@/assets/Medcoach_logo.svg" id="logo" align="left">
      </router-link>
    </b-navbar-brand>
    <!--<b-container class="col-lg-1 col-md-1 col-sm-1">
      <router-link to="/">
        <img src="@/assets/Medcoach_logo.svg" id="logo" align="left">
      </router-link>
    </b-container>-->
    <b-container class="col-lg-8 col-md-8 col-sm-8 menu">
      <b-row cols="12" cols-sm="12" cols-md="12" cols-lg="12" align="left">
        <b-col></b-col>
        <b-col>
        <router-link to="/student_dashboard">
        <img src="@/assets/home_logo_off.svg" class="menu-item" v-if="$route.name!='dashboard'">
        <div class="selected" align="center">
        <img src="@/assets/home_logo_on.svg" class="menu-item" v-if="$route.name==='dashboard'">
        <p class="textH" v-if="$route.name==='dashboard'">Home</p>
        </div>
        </router-link>

        </b-col>
        <b-col>
        <router-link to="/calendar">
        <img src="@/assets/calendario_logo_off.svg" class="menu-item" v-if="$route.name!='Calendario'">
        <img src="@/assets/calendario_logo_on.svg" class="menu-item" v-if="$route.name==='Calendario'">
        <p class="textH" v-if="$route.name==='calendario'">Calendario</p>
        </router-link>
        </b-col>
        <b-col>
          <router-link to="/manuals">
        <img src="@/assets/manuales_logo_off.svg" class="menu-item" v-if="$route.name!='Student Manuals'">
        <img src="@/assets/manuales_logo_on.svg" class="menu-item" v-if="$route.name==='Student Manuals'">
        <p class="textH" v-if="$route.name==='manuals'">Manuales</p>
          </router-link>
        </b-col>
        <b-col>
              <router-link to="/notes">
        <img src="@/assets/notas_logo_off.svg" class="menu-item" v-if="$route.name!='Student Notes'">
        <img src="@/assets/notas_logo_on.svg" class="menu-item" v-if="$route.name==='Student Notes'">
          <p class="textH" v-if="$route.name==='notes'">Notas</p>
              </router-link>
        </b-col>
        <b-col>
        <img src="@/assets/examen_logo_off.svg" class="menu-item" v-if="$route.name!='Notas'">
        <img src="@/assets/examen_logo_on.svg" class="menu-item" v-if="$route.name==='Notas'">
        </b-col>
      </b-row>
    </b-container>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown>
          <template v-slot:button-content>
            <img src="@/assets/sandwich.svg" width="30" height="30">
          </template>
          <b-dropdown-item href="#">Notificaciones</b-dropdown-item>
          <b-dropdown-item href="/settings">Configuración</b-dropdown-item>
          <b-dropdown-item href="#">Cerrar Sesión</b-dropdown-item>

        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>
})
<script>
export default {
  components: {
  },
  props: {
    // ...
  }
  // ...
}
</script>
<style>
#logo{
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
  font-size:12p x;
  color:black;
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
</style>
