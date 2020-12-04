<template>
  <div id="new_login">
    <div class="login-container bg-main">
      <nav class="login-nav">
        <img class="logo" src="/logo.png" alt="logo">
        <div>
          <a :href="buy_path">
            <button class="btn" style="margin-right: 12px;">
              <span>Comprar</span>
              <img src="/icons/cart.png" alt="cart" style="height: 30px;">
            </button>
          </a>
          <!-- <button class="btn" style="margin-right: 12px;">
            <span>Iniciar Sesión</span>
            <img src="/icons/login.png" alt="cart" style="height: 32px;">
          </button> -->
          <a :href="demo_path">
            <button class="btn btn-demo">
              <span>Probar Demo</span>
              <img src="/icons/white_hand.png" alt="cart" style="height: 25px;">
            </button>
          </a>
        </div>
      </nav>
      <section class="login-formulario">
        <div v-if="inMaintenance" class="login-form text-center">
          <p>Lo sentimos, por el momento el sitio se encuentra en mantenimiento.</p>
        </div>
        <div v-else>
          <new-login v-if="$store.state.landing === 'login'" />
          <new-recovery-password v-else-if="$store.state.landing === 'recover_password'" />
        </div>
      </section>
      <footer class="login-footer">
        <div>
          Copyright &copy; 2020 - Todos los derechos reservados. - Términos y condiciones.
        </div>
        <div class="footer-icons">
          <a href="tel:3314444950">
            <img src="/icons/phone.png" alt="teléfono">
          </a>
          <a href="https://wa.me/5213314444950" target="_blank">
            <img src="/icons/whats.png" alt="whatsapp">
          </a>
          <a href="https://www.instagram.com/spotlightmed_/" target="_blank">
            <img src="/icons/instagram.png" alt="instagram">
          </a>
          <a href="https://www.facebook.com/spotlightmed/" target="_blank">
            <img src="/icons/facebook.png" alt="facebook">
          </a>
          <a href="https://twitter.com/spotlightmed" target="_blank">
            <img src="/icons/twitter.png" alt="twitter">
          </a>
          <a href="mailto:enarm@spotlightmed.com">
            <img src="/icons/white_email.png" alt="email">
          </a>
        </div>
      </footer>
    </div>
    <div class="only-small-device">
      <p v-if="inMaintenance">
        Lo sentimos, por el momento el sitio se encuentra en mantenimiento.
      </p>
      <p v-else>
        Este ingreso sólo es disponible por computadora.
      </p>
    </div>
    <img class="dr-prieto" src="/dr_prieto.png" alt="doctor">
  </div>
</template>
<script>
import NewLogin from '@/components/landing/NewLogin'
import NewRecoveryPassword from '@/components/landing/NewRecoveryPassword'
export default {
  layout: 'index',
  components: {
    NewLogin,
    NewRecoveryPassword
  },
  data () {
    return {
      inMaintenance: false,
      buy_path: '/welcome_payment',
      demo_path: '/demo'
    }
  },
  created () {
    const bubble = process.env.BASE_PATH_BUBBLE
    this.demo_path = bubble + this.demo_path
    this.buy_path = bubble + this.buy_path

    if (this.$route.query.invalid_token) {
      this.$toastr.error(this.$route.query.invalid_token, 'Error')
      this.$router.replace({ query: null })
    }
    this.inMaintenance = (process.env.IN_MAINTENANCE === 'true')
  }
}
</script>
<style lang="less">
  ::-webkit-input-placeholder { /* Edge */
    color: #C8CCD6 !important;
  }
  ::placeholder {
    color: #C8CCD6 !important;
    opacity: 1; /* Firefox */
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
   color: #C8CCD6 !important;
  }
  ::-ms-input-placeholder { /* Microsoft Edge */
   color: #C8CCD6 !important;
  }
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    src: url(/fonts/Poppins/Poppins-Regular.ttf);
  }
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    src: url(/fonts/Poppins/Poppins-SemiBold.ttf);
  }
  #new_login {
    background-image: url('/background_login.png');
    background-position: center;
    background-size: cover;
    color: white;
    height: 100vh;
    width: 100vw;
    position: relative;
    font-family: 'Poppins';
    .only-small-device {
      text-align: center;
      padding-top: 100px;
      font-size: 20px;
    }
    .dr-prieto {
      width: 90%;
      height: auto;
      position: absolute;
      bottom: 0px;
      right: 0px;
    }
    .login-container {
      display: none;
      flex-direction: column;
      height: 100%;
      /*margin-bottom: auto;*/
      padding: 32px 150px 32px 50px;
      .login-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 100px;
        .logo {
          height: 32px;
        }
        .btn {
          border: thin solid white;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          width: 180px;
          height: 48px;
          &-demo {
            background-color: #FF8E0C;
            color: white;
            border-color: #FF8E0C;
          }
        }
      }

      .login-formulario {
        margin: auto;
        padding-left: 100px;
        .title {
          font-size: 40px;
          text-align: center;
          font-weight: 600;
          margin-bottom: 40px;
        }
        .input-icon {
          align-items: center;
          background-color: white;
          border-radius: 8px;
          display: flex;
          margin-bottom: 24px;
          padding: 12px;
          width: 400px;
          img {
            height: 25px;
          }
          input {
            width: 90%;
            border: none;
            outline: none;
            margin-left: 10px;
          }
        }
        .btn-login {
          margin-bottom: 16px;
          margin-top: 36px;
          button {
            background-color: #FF8E0C;
            border-radius: 8px;
            border: none;
            color: white;
            display: block;
            font-weight: 600;
            height: 50px;
            outline: none;
            text-align: center;
            width: 400px;
          }
        }
        .link{
          color: #C8CCD6;
          font-size: 14px;
          &:hover {
            color: white;
          }
        }
      }

      .login-footer {
        align-items: center;
        color: #C8CCD6;
        display: flex;
        font-size: 12px;
        justify-content: space-between;
        /*margin-top: auto;*/
        width: 70vw;
        .footer-icons {
          img {
            height: 26px;
            margin-right: 16px;
          }
        }
      }
    }
  }
  @media (min-width: 1000px) {
    .login-container{
      display: flex !important;
    }
    .dr-prieto {
      width: auto !important;
      height: 60% !important;
    }
  }
</style>
