<template>
  <div id="notifications">
    <div v-if="onHttpRequest">
      <loading-state :message="message" />
    </div>
    <div v-else-if="errorHttp">
      <p>{{ message }}</p>
    </div>
    <div v-else>
      <notifications-index />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import NotificationsIndex from '@/components/notifications/notificationsIndex.vue'

export default {
  components: {
    LoadingState,
    NotificationsIndex
  },
  computed: {
    ...mapState({
      onHttpRequest: state => state.http_request.onHttpRequest,
      message: state => state.http_request.message,
      errorHttp: state => state.http_request.errorHttp
    })
  }
}
</script>
