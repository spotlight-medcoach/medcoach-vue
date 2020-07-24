Vue.component('landingheader', {
<template>
  <div>
    <div class="maincontainer"></div>
    <b-navbar toggleable="lg" type="white" variant="white" fixed="top" class="bottomBorder">
    <b-navbar-brand class="col-lg-1">
      <img src="@/assets/images/logo.svg" id="logo" align="left">
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item class="item-border-right pr-4 mr-4 demo mt-2" href="https://app.spotlightmed.com/version-test/demo_dashboard">
          <b>DEMO</b>
        </b-nav-item>

        <b-nav-item href="https://app.spotlightmed.com/version-test/welcome_payment" class="mr-3">
          <img src="@/assets/icons/cart.svg" width="35" height="35">
        </b-nav-item>

        <b-nav-item-dropdown class="landing-item">
          <template v-slot:button-content>
            <img src="@/assets/icons/login.svg" width="35" height="35">
          </template>
          <div class="login-form">
            <div class="control-input d-flex">
              <p><b-icon-person></b-icon-person></p>
              <input type="text" v-model="user" placeholder="Usuario" />
            </div>
            <br>
             <div class="control-input d-flex">
              <p><b-icon-lock-fill></b-icon-lock-fill></p>
              <input v-model="password" type="password" placeholder="Contraseña" />
            </div>
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
              <p style="font-size:12px">He olvidado la contraseña</p>
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
            this.$store.commit('setToken', res.data.token)
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
    border-color: #929292;
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
  .landing-item {
    color: white !important;
  }
  .landing-item > .dropdown-menu {
    left: -275px !important;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.25);
    border-radius: 23px;
    width: 320px;
  }

  .dropdown-item.active, .dropdown-item:active{
    background-color: transparent !important;
  }

  .login-form {
    margin: 30px;
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
  .demo {
    height: 2rem;
    padding-top: 0px;
  }
  .demo a{
    padding-top: 0.3rem !important;
  }
  .control-input {
    border-bottom: thin solid #929292;
  }
  .control-input input {
    width: 85%;
    padding-left: 5px;
    border: none;
    font-size: 15px;
    color: black;
  }
  .control-input input:focus{
    border: none !important;
  }
  .control-input p {
    font-size: 1.4rem;
    margin-bottom: 0px;
    color: #929292;
  }
  .login-form input:focus {
    outline: none !important;
    outline-width: 0 !important;
  }
  ::placeholder {
    color: black !important;
  }
</style>
