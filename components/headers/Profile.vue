<template>
  <div id="profile">
    <img :src="profile_img" alt="perfil" class="cursor-pointer">
    <div class="card-profile" v-if="user">
      <div class="card-profile-content">
        <p class="user-name mb-16px ml-3">{{ `${user.first_name} ${user.last_name}` }}</p>
        <ul>
          <li class="mb-10px">
            <nuxt-link to="/settings" class="link link-default link-no-decoration">
              Modificar Perfil
            </nuxt-link>
          </li>
          <li @click="logout">
            <span class="link link-default link-no-decoration">Cerrar sesión</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      profile_img: require('@/assets/images/profile.png')
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
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
<style lang="scss">
  #profile {
    position: relative;
    padding: 5px 0px;

    .card-profile {
      position: absolute;
      right: 0;
      top: 42px;
      z-index: 100;
      display: none;

      &-content {
        min-width: 225px;
        background: #FFFFFF;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.239922);
        white-space: nowrap;
        padding: 15px;
        text-align: right;
        position: relative;

        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        .user-name {
          font-weight: 700;
          font-size: 18px;
          line-height: 22px;
          letter-spacing: 0.156522px;
          font-style: normal;
        }

        &:before {
          position: absolute;
          content: "";
          width: 10px;
          height: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          border-left: 1px solid rgba(0, 0, 0, 0.05);
          background-color: white;
          top: -4px;
          right: 10px;
           transform: rotate(45deg);
        }
      }
    }

    &:hover .card-profile {
      display: block;
    }
  }
</style>
