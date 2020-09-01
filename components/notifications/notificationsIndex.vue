<template>
<div>
  <div class="headline my-4 text-center">
    Mis notificaciones
  </div>
  <div
    v-for="(noti, index) in notifications"
    :key="`noti${index}`"
    class="card px-4 py-2 mb-3 mx-auto"
    :class="{simulator: noti.type === 'simuladores', disabled: noti.readed}">
    <div class="d-flex justify-content-between">
      <div class="title"> {{ noti.title }} </div>
      <div
        v-if="noti.type === 'simuladores'"
        class="d-flex align-items-center orange"
        :class="{pointer: !noti.readed}"
        @click="goToSimulator(noti.id, noti.readed)">
        Ir a simuladores
        <div style="font-size:1.5rem">
          <b-icon icon="chevron-right"></b-icon>
        </div>
      </div>
      <div
        v-else
        @click="goToManual(noti.id, noti.readed, noti.manual_id)"
        class="d-flex align-items-center orange"
        :class="{pointer: !noti.readed}">
        Ver manual
        <div style="font-size:1.5rem">
          <b-icon icon="chevron-right"></b-icon>
        </div>
      </div>
    </div>
    <div>{{ noti.content }} - {{ noti.date }}</div>
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
      notifications: state => state.notifications.data
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
    },
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
  #notifications {
    .headline {
      font-size: 1.75rem;
      font-weight: 700;
    }
    .card {
      border: thin solid #C4C4C4;
      width: 80%;
      border-radius: 10px;
      .title {
        font-size: 1.5rem;
        font-weight: 700;
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
