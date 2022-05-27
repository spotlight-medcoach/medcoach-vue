<template>
  <div>
    <div class="d-flex">
      <button
        class="btn-sec mr-4"
        :disabled="session !== '1'"
        :class="{'disabled': session !== '1'}"
        @click="setSession('1')"
      >
        DÍA 1 SESIÓN 1</button>
      <!-- <button
        class="btn-sec"
        :disabled="session !== '2'"
        :class="{'disabled': session !== '2'}"
        @click="setSession('2')"
      >
        DÍA 1 SESIÓN 2
      </button> -->
    </div>
    <button
      v-if="showFinishButton"
      class="red-theme btn-finish"
      style="margin-top: 48px"
      @click="$emit('onFinishTest')"
    >
      FINALIZAR
    </button>
  </div>
</template>
<script>
export default {
  name: 'select-session',
  props: {
    session: {
      type: String,
      required: true
    },
    showFinishButton: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    setSession (value) {
      this.$emit('onClick', value)
    }
  }
}
</script>
