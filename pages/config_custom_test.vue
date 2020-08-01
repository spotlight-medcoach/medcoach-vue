<template>
<div id="config_custom_test">
  <div v-if="onHttpRequest">
    <loading-state :message="message" />
  </div>
  <div v-else-if="errorHttp">
    <p>{{ message }}</p>
  </div>
  <div v-else>
    <config-test />
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import ConfigTest from '@/components/custom-test/ConfigTest.vue'

export default {
  components: {
    LoadingState,
    ConfigTest
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
