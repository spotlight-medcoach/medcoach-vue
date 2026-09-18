<template>
  <div>
    <div class="headline my-4 text-center">Mis notificaciones</div>
    <div
      v-for="(noti, index) in notifications"
      :key="`noti${index}`"
      class="card px-4 py-2 mb-3 mx-auto"
      :class="{
        simulator: noti.type === 'simuladores',
        disabled: noti.readed && noti.type !== 'simuladores',
      }"
    >
      <div class="d-flex justify-content-between">
        <div class="title">{{ noti.title }}</div>
        <div
          v-if="noti.type === 'simuladores'"
          class="d-flex align-items-center orange pointer"
          @click="goToSimulator(noti.id, noti.readed)"
        >
          Ir a simuladores
          <div style="font-size: 1.5rem">
            <b-icon icon="chevron-right" />
          </div>
        </div>
        <!-- Sólo las de manual tienen a dónde ir; un aviso general no lleva CTA. -->
        <div
          v-else-if="noti.manual_id"
          class="d-flex align-items-center orange"
          :class="{ pointer: !noti.readed }"
          @click="goToManual(noti.id, noti.readed, noti.manual_id)"
        >
          Ver manual
          <div style="font-size: 1.5rem">
            <b-icon icon="chevron-right" />
          </div>
        </div>
      </div>
      <div>{{ noti.content }} - {{ noti.date }}</div>
    </div>
    <p v-if="!notifications.length" class="text-center mt-5">
      No tiene nuevas notificaciones
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { goToSimulatorsApp } from '@/helpers/simulatorsApp';
export default {
  computed: {
    ...mapState({
      notifications: (state) => state.notifications.data,
    }),
  },
  methods: {
    goToManual (notiId, readed, manualId) {
      if (!readed) {
        this.$store
          .dispatch('notifications/readNotification', notiId)
          .then(() => {
            this.$router.push({
              path: '/manual',
              query: { manual_id: manualId },
            });
          });
      }
    },
    goToSimulator (notiId, readed) {
      // Las de simuladores siempre llevan a la app externa de simuladores.
      // Marcarlas como leídas no debe desactivar el CTA, así que se sale
      // pase lo que pase con el dispatch.
      if (readed) {
        goToSimulatorsApp();
        return;
      }
      // Es una salida de la SPA: si no se espera al POST, el navegador lo
      // cancela a medio vuelo y la notificación nunca queda leída.
      this.$store
        .dispatch('notifications/readNotification', notiId)
        .then(goToSimulatorsApp, goToSimulatorsApp);
    },
  },
};
</script>

<style lang="scss">
#notifications {
  .headline {
    font-size: 1.75rem;
    font-weight: 700;
  }
  .card {
    border: thin solid #c4c4c4;
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
