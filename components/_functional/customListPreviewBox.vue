<template>
  <div class="item-list-container">
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <div class="item my-2 p-2">
          <b-skeleton width="140px" />
          <div class="icon-container">
            <b-icon icon="chevron-right" />
          </div>
        </div>
        <div class="item my-2 p-2">
          <b-skeleton width="180px" />
          <div class="icon-container">
            <b-icon icon="chevron-right" />
          </div>
        </div>
        <div class="item my-2 p-2">
          <b-skeleton width="120px" />
          <div class="icon-container">
            <b-icon icon="chevron-right" />
          </div>
        </div>
      </template>
      <template v-if="items.length">
        <div
          v-for="(item, index) in items"
          :key="`item${index}`"
          class="item my-2 p-2"
          :class="item.enabled ? 'pointer': 'disabled'"
          @click="itemSelected(item)"
        >
          <div class="text-xl-content">
            {{ item.title }}
          </div>
          <div class="icon-container">
            <b-icon icon="chevron-right" />
          </div>
        </div>
      </template>
      <template v-else>
        <p class="text-center mt-5">
          {{onEmptyListMessage}}
        </p>
      </template>
    </b-skeleton-wrapper>
  </div>
</template>
<script>

// interface listItem {
//     id: string;
//     title: number;
//     hint: number;
//     enabled: string;
//     data: Object;
// }

export default {
  name: 'CustomListPreviewBox',
  props: {
    loading: {
      type: Boolean,
      default: () => true
    },
    onEmptyListMessage: {
      type: String,
      default: 'No se encontraron elementos'
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    itemSelected (item) {
      if (item.enabled) {
        this.$emit('item-selected', item.data)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .item-list-container {
    .item {
      border: 1px solid #979797;
      display: grid;
      grid-template-columns: 2fr auto;
      grid-auto-rows: 1fr;
      min-height: 50px;
      align-items: center;
      .subheader-md {
        font-weight: 900;
      }
      .icon-container {
        align-self: center;
        border: 1px solid #979797;
        border-radius: 2px;
        width: 18px;
        height: 18px;
        font-size: 13px;
        text-align: center;
      }
    }
    .disabled {
      opacity: 0.3;
    }
  }
</style>
