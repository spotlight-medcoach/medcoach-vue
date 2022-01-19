<template>
  <div id="dashboard-notifications">
    <h3 class="my-2 text-center header-md">Notificaciones</h3>
    <hr class="mb-0 mt-4">
    <div
      v-for="(noti, index) in notifications"
      :key="`noti${index}`"
      class="notification py-2 mx-auto"
      :class="noti.readed ? 'disabled': 'pointer'"
      @click="goToManual(noti.id, noti.readed, noti.manual_id)">
      <div class="subheader-md">
        {{ noti.title }}
      </div>
      <div class="subheader-xs">
        {{ noti.content }} - {{ noti.date }}
      </div>
      <div class="icon-container">
        <b-icon icon="chevron-right"></b-icon>
      </div>
    </div>
    <p class="text-center mt-5" v-if="!notifications.length">
      No tiene nuevas notificaciones
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      notifications: state => state.notifications.data.filter(noti => noti.type !== 'simuladores')
    })
  },
  methods: {
    goToManual (notiId, readed, manualId) {
      if (!readed) {
        this.$store.dispatch('notifications/readNotification', notiId)
          .then(() => {
            this.$router.push({ path: '/manual', query: { manual_id: manualId } })
          })
      }
    }
  }
}
</script>

<style lang="scss">
  #dashboard-notifications {
    hr {
      border-color:#000000;
    }
    .notification {
      border-bottom: 1px solid #979797;
      display: grid;
      grid-template-columns: 2fr;
      grid-auto-rows: 2fr;
      .subheader-md {
        font-weight: 900;
      }
      .icon-container {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
        align-self: center;
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
