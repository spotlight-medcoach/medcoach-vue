<template>
  <div class="item-list-container">
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <div class="item py-2">
          <b-skeleton width="140px"></b-skeleton>
          <b-skeleton width="80px"></b-skeleton>
          <div class="icon-container">
            <b-icon icon="chevron-right"></b-icon>
          </div>
        </div>
        <div class="item py-2">
          <b-skeleton width="180px"></b-skeleton>
          <b-skeleton width="30px"></b-skeleton>
          <div class="icon-container">
            <b-icon icon="chevron-right"></b-icon>
          </div>
        </div>
        <div class="item py-2">
          <b-skeleton width="120px"></b-skeleton>
          <b-skeleton width="90px"></b-skeleton>
          <div class="icon-container">
            <b-icon icon="chevron-right"></b-icon>
          </div>
        </div>
      </template>
      <template v-if="items.length">
        <div
          v-for="(item, index) in items"
          :key="`item${index}`"
          class="item py-2 mx-auto"
          :class="item.enabled ? 'pointer': 'disabled'"
          @click="itemSelected(item)"
        >
          <div class="subheader-lg">
            {{ item.title }}
          </div>
          <div class="subheader-xs">
            {{ item.hint }}
          </div>
          <div class="icon-container">
            <b-icon icon="chevron-right"></b-icon>
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
  name: 'CustomListPreviewTwoLines',
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
    overflow-y: auto;
    height: calc(100% - 65px);
    margin-right: -7px;
    padding-right: 7px;
    .item {
      border-bottom: 1px solid #979797;
      display: grid;
      grid-template-columns: 1fr auto;
      grid-auto-rows: 1fr 1fr;
      .subheader-lg {
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
