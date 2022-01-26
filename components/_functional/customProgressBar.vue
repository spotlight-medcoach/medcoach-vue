<template>
  <div align="left" class="custom-progress" :class="enabled ? colorVariant : 'neutral'">
    <!-- Top header -->
    <div
      v-if="topHeader"
      class="subheader-xl font-weight-utra-bolder mb-1"
    >
      {{ topHeader }}
    </div>
    <!-- Top hint -->
    <div
      v-if="topHint"
      class="text-lg-content font-weight-utra-bolder">
      {{ topHint }}
    </div>
    <!-- Progress bar -->
    <b-progress
      :max="totalValue"
      :value="actualValue"
      :precision="2"
      class="mb-2 mt-2"
    />
    <!-- Bottom header -->
    <div v-if="bottomHeader || bottomSubheader" class="d-inline-flex align-items-center">
      <h3 v-if="bottomHeader" class="subheader-xl pr-2 font-weight-utra-bolder">
        {{ bottomHeader }}
      </h3>
      <h4 v-if="bottomSubheader" class="subheader-xs font-weight-utra-bolder">
        {{ bottomSubheader }}
      </h4>
    </div>
    <!-- Bottom hint -->
    <div v-if="bottomHint">
      <p class="text-xs-content font-weight-utra-bolder">
        {{ bottomHint }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomProgressBar',
  props: {
    actualValue: {
      type: Number,
      default: 0
    },
    totalValue: {
      type: Number,
      default: 0
    },
    colorVariant: {
      type: String,
      default: 'neutral'
    },
    topHeader: {
      type: String,
      default: undefined
    },
    topHint: {
      type: String,
      default: undefined
    },
    bottomHeader: {
      type: String,
      default: undefined
    },
    bottomSubheader: {
      type: String,
      default: undefined
    },
    bottomHint: {
      type: String,
      default: undefined
    },
    enabled: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/css/variables/color-palette.scss';
  .custom-progress {
    .progress {
      height: 11px;
      border-radius: 2px;
    }
    .text-xs-content {
      color: #000000;
    }
    &.neutral {
      color: #{$neutral-400};
      .progress {
        border: 1px solid #{$neutral-400};
        background-color: #{$neutral-50};
        ::v-deep .progress-bar {
          background-color: #{$neutral-400};
        }
      }
    }
    &.blue {
      color: #{$accent_b-500};
      .progress {
        border: 1px solid #{$accent_b-500};
        background-color: #{$accent_b-50};
        ::v-deep .progress-bar {
          background-color: #{$accent_b-500};
        }
      }
    }
    &.orange {
      color: #{$main-500};
      .progress {
        border: 1px solid #{$main-500};
        background-color: #{$main-50};
        ::v-deep .progress-bar {
          background-color: #{$main-500};
        }
      }
    }
    &.pink {
      color: #{$accent_a-500};
      .progress {
        border: 1px solid #{$accent_a-500};
        background-color: #{$accent_a-50};
        ::v-deep .progress-bar {
          background-color: #{$accent_a-500};
        }
      }
    }
  }
</style>
