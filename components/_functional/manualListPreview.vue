<template>
  <div class="manual-list-container">
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <div class="manual-item py-2">
          <b-skeleton width="140px"></b-skeleton>
          <b-skeleton width="80px"></b-skeleton>
          <div class="icon-container">
            <b-icon icon="chevron-right"></b-icon>
          </div>
        </div>
        <div class="manual-item py-2">
          <b-skeleton width="180px"></b-skeleton>
          <b-skeleton width="30px"></b-skeleton>
          <div class="icon-container">
            <b-icon icon="chevron-right"></b-icon>
          </div>
        </div>
        <div class="manual-item py-2">
          <b-skeleton width="120px"></b-skeleton>
          <b-skeleton width="90px"></b-skeleton>
          <div class="icon-container">
            <b-icon icon="chevron-right"></b-icon>
          </div>
        </div>
      </template>
      <div
        v-for="(manual, index) in manuals"
        :key="`manual${index}`"
        class="manual-item py-2 mx-auto"
        :class="manual.readed ? 'disabled': 'pointer'"
        @click="goToManual(manual.id, manual.readed, manual.manual_id)">
        <div class="subheader-md">
          {{ manual.title }}
        </div>
        <div class="subheader-xs">
          {{ manual.hint }}
        </div>
        <div class="icon-container">
          <b-icon icon="chevron-right"></b-icon>
        </div>
      </div>
    </b-skeleton-wrapper>
  </div>
</template>
<script>
export default {
  name: 'ManualListPreview',
  props: {
    loading: {
      type: Boolean,
      default: () => true
    },
    manuals: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
  .manual-list-container {
    .manual-item {
      border-bottom: 1px solid #979797;
      display: grid;
      grid-template-columns: 1fr auto;
      grid-auto-rows: 1fr 1fr;
      .subheader-md {
        font-weight: 900;
      }
      .icon-container {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
        align-self: center;
      }
    }
    .disabled {
      opacity: 0.3;
    }
  }
</style>
