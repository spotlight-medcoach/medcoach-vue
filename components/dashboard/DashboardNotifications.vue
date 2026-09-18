<template>
  <div id="dashboard-notifications">
    <h3 class="my-2 text-center body-title-2">Notificaciones</h3>
    <hr class="mb-0 mt-4">
    <custom-list-preview-two-lines
      :loading="loading"
      :items="notifications"
      :on-empty-list-message="'No tiene nuevas notificaciones'"
      @item-selected="itemSelected"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import CustomListPreviewTwoLines from '@/components/_functional/customListPreviewTwoLines.vue';
import { goToSimulatorsApp } from '@/helpers/simulatorsApp';
export default {
  components: {
    CustomListPreviewTwoLines,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      notifications: (state) =>
        state.notifications.data
          .sort((notiA, notiB) => {
            if (notiB.readed) {
              return -1;
            }
            return new Date(notiA) < new Date(notiB);
          })
          .map((noti) => {
            return {
              // El id de la notificación, no manual_id: los avisos
              // generales no traen manual y marcarlas como leídas
              // necesita este id.
              id: noti.id,
              title: noti.title,
              hint: `${noti.content} - ${noti.date}`,
              // Las de simuladores siempre se pueden abrir, leídas o no.
              enabled: noti.type === 'simuladores' || !noti.readed,
              data: noti,
            };
          }),
    }),
  },
  methods: {
    itemSelected (notification) {
      const isSimulator = notification.type === 'simuladores';
      // Las de simuladores siempre salen a la app externa, leídas o no.
      if (notification.readed) {
        if (isSimulator) {
          goToSimulatorsApp();
        }
        return;
      }
      const markAsRead = this.$store.dispatch(
        'notifications/readNotification',
        notification.id,
      );
      if (isSimulator) {
        // Es una salida de la SPA: si no se espera al POST, el navegador lo
        // cancela a medio vuelo y la notificación nunca queda leída.
        markAsRead.then(goToSimulatorsApp, goToSimulatorsApp);
        return;
      }
      markAsRead.then(() => {
        // Sólo las de manual llevan a algún lado. Un aviso general se
        // marca como leído y se queda donde está.
        if (notification.manual_id) {
          this.$router.push({
            path: '/manual',
            query: { manual_id: notification.manual_id },
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
hr {
  border-color: #000000;
}
custom-list-preview-two-lines {
  overflow-y: scroll;
}
</style>
