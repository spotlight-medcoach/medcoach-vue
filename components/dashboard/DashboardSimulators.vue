<template>
  <div id="dashboard-simulators">
    <h3 class="my-2 text-center subheader-xl font-weight-utra-bolder">Simuladores</h3>
    <hr class="mb-0 mt-4">
    <custom-list-preview-box
      :loading="loading"
      :items="notifications"
      :onEmptyListMessage="'No tiene nuevos simuladores'"
      @item-selected="itemSelected"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import CustomListPreviewBox from '@/components/_functional/CustomListPreviewBox.vue'
export default {
  components: {
    CustomListPreviewBox
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
        .filter(noti => noti.type === 'simuladores')
        .map((noti) => {
          return {
            id: noti.manual_id,
            title: noti.title,
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
          this.$router.push({ path: '/simulators' })
        })
    }
  }
}
</script>

<style lang="scss">
  #dashboard-simulators {
    hr {
      border-color:#000000;
    }
  }
</style>
