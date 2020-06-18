Vue.component('landingheader', {
<template>
  <div>
    <div class="maincontainer"></div>
    <b-navbar toggleable="lg" type="white" variant="white" fixed="top" class="bottomBorder">
    <b-navbar-brand href="#" class="col-lg-1">
      <router-link to="/">
        <img src="@/assets/Medcoach_logo.svg" id="logo" align="left">
      </router-link>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item class="item-border-right"><b>DEMO</b></b-nav-item>

        <b-nav-item>
          <img src="@/assets/cart.svg" width="30" height="30">
        </b-nav-item>

        <b-nav-item-dropdown class="landing-item">
          <template v-slot:button-content>
            <img src="@/assets/login.svg" width="30" height="30">
          </template>
          <div class="login-form">
            <b-row cols="6">
              <b-col>
                <b-icon-person style="width: 35px; height: 35px;" shift-h="5"></b-icon-person>
              </b-col>
              <b-col cols="5">
                <b-form-input style="width:200px; font-size:15px"  v-model="user" placeholder="Usuario"></b-form-input>
              </b-col>
            </b-row>
            <br>
            <b-row cols="6">
              <b-col>
                <b-icon-lock-fill style="width: 30px; height: 30px;" shift-h="8" shift-v="-3"></b-icon-lock-fill>
              </b-col>
              <b-col cols="5">
                <b-form-input style="width:200px; font-size:15px" v-model="password" type="password" placeholder="Contraseña"></b-form-input>
              </b-col>
            </b-row>
            <br>
            <div align="center">
              <div class="divlogin" align="center">
                <b-overlay
                  :show="busy"
                  rounded
                  opacity="0.6"
                  spinner-small
                  spinner-variant="primary"
                  class="d-inline-block"
                >
                  <button class="blogin" v-on:click="login()" type="button">Ingresar</button>
                </b-overlay>
              </div>
            </div>
            <br>
            <div align="center">
              <p style="font-size:12px">Ha olvidado la contraseña</p>
            </div>
          </div>
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
  data () {
    return {
      user: '',
      password: '',
      busy: false,
      timeout: null
    }
  },
  created () {
    if (process.client) {
      console.log('Token: ', localStorage.getItem('usertoken'))
    }
  },
  props: {
    // ...
  },
  methods: {
    login () {
      this.busy = true

      this.$axios
        .post('/students/login', {
          email: this.user, // "carlospdcg@hotmail.com"
          password: this.password // "12345678"
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          const userData = res.data.payload
          console.log(userData)
          if (process.client) {
            localStorage.setItem('studentData', JSON.stringify(userData))
            localStorage.setItem('usertoken', res.data.token)
          }
          this.$router.push({ path: '/dashboard' })
        })
        .catch((err) => {
          console.log(err)
          this.busy = false
        })
    }
  }
}
</script>
<style>
  #logo {
    float: left;
    width: 150px;
    padding: 10px;
  }
  .bottomBorder {
    border-bottom: 1px solid;
  }
  .divlogin {
    width: 30%;
    height: auto;
    border-color: black;
    border-top-style: none;
    border-right-style: solid;
    border-bottom-style: none;
    border-left-style: solid;
    border-width: 1px;
  }
  .blogin {
    font-family: Avenir;
    background-color:white;
    border-style:none;
  }
  .loginform{
    top: 30px;
    position: fixed;
    z-index: 1;
  }
  .maincontainer{
    position:fixed;
    z-index:0;
  }

  .landing-item > .dropdown-menu {
    left: -275px !important;
  }

  .dropdown-item.active, .dropdown-item:active{
    background-color: transparent !important;
  }

  .login-form {
    margin: 20px;
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

  .menu {
    height: 60px;
  }
</style>
