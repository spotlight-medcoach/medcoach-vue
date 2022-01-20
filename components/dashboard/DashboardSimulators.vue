<template>
  <div id="dashboard-simulators">
    <h3 class="my-2 text-center header-md">Simuladores</h3>
    <hr class="mb-0 mt-4">
    <div
      v-for="(noti, index) in notifications"
      :key="`noti${index}`"
      class="notification mx-auto">
      <div class="subheader-lg">
        {{ noti.title }}
      </div>
      <div
        class="icon-container"
        :class="noti.readed ? 'disabled': 'pointer'"
        @click="goToSimulator(noti.id, noti.readed)">
        <b-icon icon="chevron-right"></b-icon>
      </div>
    </div>
    <p class="text-center mt-5" v-if="!notifications.length">
      No tiene nuevos simuladores
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      notifications: state => state.notifications.data.filter(noti => noti.type === 'simuladores')
    })
  },
  methods: {
    goToSimulator (notiId, readed) {
      if (!readed) {
        this.$store.dispatch('notifications/readNotification', notiId)
          .then(() => {
            this.$router.push({ path: '/simulators' })
          })
      }
    }
  }
}
</script>

<style lang="scss">
  #dashboard-simulators {
    hr {
      border-color:#000000;
    }
    .notification {
      border: 1px solid #979797;
      display: grid;
      grid-template-columns: 2fr auto;
      grid-auto-rows: 1fr;
      min-height: 50px;
      align-items: center;
      cursor: default;
      .subheader-md {
        font-weight: 900;
      }
      .icon-container {
        align-self: center;
        border: 1px solid #979797;
        border-radius: 2px;
        width: 18px;
        height: 18px;
        font-size: 13px;
        text-align: center;
      }
    }
    .simulator {
      background-color: black;
      color: white;
    }
    .disabled {
      opacity: 0.3;
    }
  }
</style>
