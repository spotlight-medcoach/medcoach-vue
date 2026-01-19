<template>
  <div id="custom_test_retro">
    <div v-if="!fetchedTest">
      <loading-state message="Cargando retroalimentación..." />
    </div>
    <div v-else class="h-100">
      <CustomTestRetro />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoadingState from '@/components/LoadingState.vue';
import CustomTestRetro from '@/components/custom_test/CustomTestRetro.vue';

export default {
  components: {
    LoadingState,
    CustomTestRetro,
  },
  layout: 'new_default',
  computed: {
    ...mapState({
      fetchedTest: (state) => state.custom_test.fetchedTest,
      custom_test: (state) => state.custom_test.customTest,
    }),
  },
  async created () {
    if (!this.$route.query.custom_test_id) {
      alert('No hay custom test id');
      this.$router.push({ path: '/custom_test_config' });
      return;
    }

    this.$store.commit('custom_test/initCustomTest');
    await this.$store.dispatch(
      'custom_test/fetchCustomTestRetro',
      this.$route.query.custom_test_id,
    );

    if (this.custom_test?.questions?.length) {
      this.$store.commit(
        'custom_test/setSelectedQuestion',
        this.custom_test.questions[0],
      );
    }
  },
};
</script>
<style>
#custom_test_retro {
  background: #fbfdfe !important;
}
</style>
