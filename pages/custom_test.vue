<template>
  <div id="custom_test" class="">
    <div v-if="loading">
      <loading-state :message="message" />
    </div>
    <div v-else-if="errorHttp">
      <p>{{ message }}</p>
    </div>
    <div v-else-if="sendingAnswers">
      <loading-state message="Enviando respuestas, por favor espere" />
    </div>
    <div v-else class="h-100">
      <CustomTest ref="customTest" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoadingState from '@/components/LoadingState.vue';
import CustomTest from '@/components/custom_test/CustomTest.vue';
export default {
  components: {
    LoadingState,
    CustomTest,
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs.customTest) {
      this.$refs.customTest.finalize();
    }
    // Persist any debounced progress so it's not lost when leaving
    this.$store.commit('custom_test/flushPersistToStorage');
    next();
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
      sendingAnswers: (state) => state.custom_test.sendingAnswers,
      customTest: (state) => state.custom_test.customTest,
    }),
  },
  async created () {
    if (!this.$route.query.custom_test_id) {
      alert('No hay custom test id');
      this.$router.push({ path: '/custom_test_config' });
      return;
    }

    try {
      const customTestId = this.$route.query.custom_test_id;
      this.$store.commit('custom_test/initCustomTest');

      const cachedTest = JSON.parse(
        localStorage.getItem(`test_${customTestId}`),
      );
      if (cachedTest) {
        await this.$store.dispatch('custom_test/loadCustomTest', cachedTest);
      } else {
        await this.$store.dispatch('custom_test/fetchCustomTest', customTestId);
      }

      if (this.customTest && this.customTest.questions) {
        this.$store.commit(
          'custom_test/setSelectedQuestion',
          this.customTest.questions[0],
        );
      }
    } catch (error) {
      console.error('Error loading custom test:', error);
    } finally {
      this.loading = false;
    }
  },
};
</script>
<style>
#custom_test {
  background: #fbfdfe !important;
}
</style>
