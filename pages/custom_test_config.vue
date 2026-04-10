<template>
  <div id="config_custom_test">
    <div v-if="loading">
      <loading-state :message="message" />
    </div>
    <div v-else-if="errorHttp">
      <p>{{ message }}</p>
    </div>
    <div v-else>
      <CustomTestConfig />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoadingState from '@/components/LoadingState.vue';
import CustomTestConfig from '@/components/custom_test_config/CustomTestConfig.vue';

export default {
  components: {
    LoadingState,
    CustomTestConfig,
  },
  layout: 'new_default',
  data () {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapState({
      message: (state) => state.http_request.message,
      errorHttp: (state) => state.http_request.errorHttp,
    }),
  },
  async created () {
    try {
      const { custom_test: ct } = this.$store.state;
      if (ct.timer) {
        clearInterval(ct.timer);
      }
      this.$store.commit('custom_test/setTimer', null);
      this.$store.commit('custom_test/setTimerString', '');
      this.$store.commit('custom_test/initCustomTest');
      this.$store.commit('custom_test/setSelectedQuestion', null);
      this.$store.commit('custom_test/RESET_TOPICS');
      this.$store.commit('custom_test/setType', '');
      this.$store.commit('custom_test/setHistory', null);
      this.$store.dispatch('custom_test/fetchHistory');
      // Siempre refrescar conteos por subtema (antes solo la primera vez si fetchedData)
      await this.$store.dispatch('custom_test/init');
    } catch (error) {
      console.error('Error loading custom test config:', error);
    } finally {
      // Desactivar loading después de cargar los datos
      this.loading = false;
    }
  },
};
</script>
