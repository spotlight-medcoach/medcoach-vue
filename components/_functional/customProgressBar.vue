<template>
  <div align="left" class="custom-progress" :class="colorVariant">
    <div class="header-md font-weight-utra-bolder" v-if="topHeader">
      {{ topHeader }}
    </div>
    <div class="text-lg-content font-weight-utra-bolder mt-2" v-if="topHint">
      {{ topHint }}
    </div>
    <b-progress
      :max="totalValue"
      :value="actualValue"
      :precision="2"
      class="mb-2 mt-1"
    />
    <div class="d-inline-flex align-items-center" v-if="bottomHeader | bottomSubheader">
      <h3 class="subheader-lg pr-2 font-weight-utra-bolder" v-if="bottomHeader">
        {{ bottomHeader }}
      </h3>
      <h4 class="subheader-xs font-weight-utra-bolder" v-if="bottomSubheader">
        {{ bottomSubheader }}
      </h4>
    </div>
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
      default: 'blue'
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
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/variables/color-palette.scss';
  .custom-progress {
    .progress {
      height: 11px;
      border-radius: 2px;
    }
    .text-xs-content {
      color: #000000;
    }
    &.blue {
      color: #{$accent_b-500};
      .progress {
        border: 1px solid #{$accent_b-500};
        background-color: #{$accent_b-50};
        .progress-bar {
          background-color: #{$accent_b-500};
        }
      }
    }
    &.orange {
      color: #{$main-500};
      .progress {
        border: 1px solid #{$main-500};
        background-color: #{$main-50};
        .progress-bar {
          background-color: #{$main-500};
        }
      }
    }
    &.pink {
      color: #{$accent_a-500};
      .progress {
        border: 1px solid #{$accent_a-500};
        background-color: #{$accent_a-50};
        .progress-bar {
          background-color: #{$accent_a-500};
        }
      }
    }
  }
</style>
