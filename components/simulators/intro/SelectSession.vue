<template>
  <div class="d-flex">
    <button class="btn-sec mr-4" @click="setSession(1)">DÍA 1 SESIÓN 1</button>
    <button class="btn-sec" @click="setSession(2)">DÍA 1 SESIÓN 2</button>
  </div>
</template>
<script>
export default {
  name: 'select-session',
  methods: {
    setSession (value) {
      this.$emit('onSetSession', value)
    }
  }
}
</script>
