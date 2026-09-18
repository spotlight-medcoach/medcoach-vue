<template>
  <div id="dashboard-simulators">
    <h3 class="my-2 text-center body-title-2">Simuladores</h3>
    <hr class="mb-0 mt-4">
    <custom-list-preview-box
      :loading="loading"
      :items="notifications"
      :on-empty-list-message="'No tiene nuevos simuladores'"
      @item-selected="itemSelected"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import CustomListPreviewBox from '@/components/_functional/customListPreviewBox.vue';
import { goToSimulatorsApp } from '@/helpers/simulatorsApp';
export default {
  components: {
    CustomListPreviewBox,
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
          .filter((noti) => noti.type === 'simuladores')
          .map((noti) => {
            return {
              // El id de la notificación: las de simuladores no traen manual_id.
              id: noti.id,
              title: noti.title,
              // Un simulador siempre se puede abrir: haberlo leído no lo
              // desactiva.
              enabled: true,
              data: noti,
            };
          }),
    }),
  },
  methods: {
    itemSelected (notification) {
      // Los simuladores viven en la app externa; se sale con el handoff de
      // token, no por el router de esta SPA.
      if (notification.readed) {
        goToSimulatorsApp();
        return;
      }
      // Es una salida de la SPA: si no se espera al POST, el navegador lo
      // cancela a medio vuelo y la notificación nunca queda leída.
      this.$store
        .dispatch('notifications/readNotification', notification.id)
        .then(goToSimulatorsApp, goToSimulatorsApp);
    },
  },
};
</script>

<style lang="scss">
#dashboard-simulators {
  hr {
    border-color: #000000;
  }
}
</style>
