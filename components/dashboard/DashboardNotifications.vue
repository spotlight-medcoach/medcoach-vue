<template>
  <div id="dashboard-notifications">
    <h3 class="my-2 text-center header-md">Notificaciones</h3>
    <hr class="mb-0 mt-4">
    <custom-list-preview-two-lines
      :loading="loading"
      :items="notifications"
      :onEmptyListMessage="'No tiene nuevas notificaciones'"
      @item-selected="itemSelected"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import CustomListPreviewTwoLines from '@/components/_functional/customListPreviewTwoLines.vue'
export default {
  components: {
    CustomListPreviewTwoLines
  },
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications.data
        .filter(noti => noti.type !== 'simuladores')
        .map((noti) => {
          return {
            id: noti.manual_id,
            title: noti.title,
            hint: `${noti.content} - ${noti.date}`,
            enabled: !noti.readed,
            data: noti
          }
        })
    })
  },
  methods: {
    itemSelected (notification) {
      this.$store.dispatch('notifications/readNotification', notification.id)
        .then(() => {
          this.$router.push({ path: '/manual', query: { manual_id: notification.manual_id } })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  hr {
    border-color:#000000;
  }
</style>
