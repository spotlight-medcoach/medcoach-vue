<template>
  <section id="custom-test-history" class="custom-card">
    <div id="custom-test-history-header">
      <p class="header-lg">Historial</p>
    </div>
    <div v-if="history">
      <div v-if="history.length === 0">
        <p>No ha ralizado exámenes</p>
      </div>
      <CustomTestHistoryItem
        v-for="(item, index) in history"
        :key="`history-${index}`"
      />
    </div>
    <div v-else>
      <div class="d-flex align-items-center">
        <div>
          <div class="d-flex justify-content-around" style="font-size: 20px;">
            Cargando...
          </div>
          <div class="d-flex justify-content-around mt-3">
            <img src="@/assets/icons/loading.svg" width="50" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomTestHistoryItem from '@/components/custom_test_config/CustomTestHistoryItem'

export default {
  components: {
    CustomTestHistoryItem
  },
  computed: {
    ...mapGetters({
      history: 'custom_test/history'
    })
  }
}
</script>
<style lang="scss">
  #custom-test-history {
    padding: 20px 16px !important;

    &-header {
      text-align: center;
      margin-bottom: 20px;
      border: 1px solid #000000;
    }
  }
</style>
