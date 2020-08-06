<template>
  <div>
    <div class="bg imagen d-flex">
      <div class="bloque d-flex justify-content-center align-items-center">
        <img src="/logos.svg" class="logos">
      </div>
      <div class="bloque d-flex align-items-center">
        <div class="imagen isologo align-items-center">
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
        </div>
      </div>
    </div>
    <landing-footer></landing-footer>
  </div>
</template>

<script>
import LandingFooter from '@/components/LandingFooter'

export default {
  name: 'Home',
  components: {
    LandingFooter
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
    console.log('entorno', process.env.BASE_PATH)
    if (this.$route.query.invalid_token) {
      this.$toastr.error(this.$route.query.invalid_token, 'Error')
      this.$router.replace({ query: null })
    }
  },
  methods: {
    login () {
      this.busy = true
      this.$axios
        .post('/students/login', {
          email: this.user,
          password: this.password // "12345678"
        })
        .then((res) => {
          const userData = res.data.payload
          console.log(userData)
          if (process.client) {
            localStorage.setItem('usertoken', res.data.token)
            this.$store.commit('setToken', res.data.token)
          }
          this.$router.push({ path: '/dashboard' })
        })
        .catch((err) => {
          const response = err.response
          this.$toastr.error(response.data.message, 'Error')
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
    width: 400px;
  }

  .dropdown-item.active, .dropdown-item:active{
    background-color: transparent !important;
  }

  .login-form {
    background-color: white;
    box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.25);
    border-radius: 23px;
    width: 320px;
    border: 1px solid #C4C4C4;
    padding: 2rem 2rem .5rem 2rem;
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
    width: 100%;
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
  .imagen {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .bg {
    background-image: url("/background.png");
    width: 100%;
  }
  .bloque {
    width: 50%;
    height: 100%;
  }
  .isologo {
    background-image: url("/isologo.png");
    margin-left: 10px;
    display: grid;
  }
  @media (min-width: 1200px) {
    .bg {
      height: 77vh;
    }
    .logos {
      width: 400px;
    }
    .isologo {
      width: 400px;
      height: 400px;
    }
    .login-form {
      margin-left: 200px;
    }
  }
  @media screen and (min-width: 1600px) {
    .bg {
      height: 84vh;
    }
    .logos {
      width: 600px;
    }
    .isologo {
      width: 600px;
      height: 600px;
    }
    .login-form {
      margin-left: 300px;
    }
  }
</style>
