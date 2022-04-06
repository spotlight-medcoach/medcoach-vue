<template>
  <div id="custom_test_retro">
    <div v-if="onHttpRequest">
      <loading-state :message="message" />
    </div>
    <div v-else-if="errorHttp">
      <p>{{ message }}</p>
    </div>
    <div v-else class="h-100">
      <CustomTestRetro />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import CustomTestRetro from '@/components/custom_test/CustomTestRetro.vue'

export default {
  layout: 'new_default',
  components: {
    LoadingState,
    CustomTestRetro
  },
  computed: {
    ...mapState({
      onHttpRequest: state => state.http_request.onHttpRequest,
      message: state => state.http_request.message,
      errorHttp: state => state.http_request.errorHttp
    })
  },
  created () {
    if (!this.$route.query.custom_test_id) {
      alert('No hay custom test id')
      this.$router.push({ path: '/custom_test_config' })
    }
  }
}
</script>
<style>
  #custom_test_retro {
    background: #FBFDFE !important;
  }
</style>
