<template>
  <div id="block-message">
    <div class="title red-theme">
      {{ title }}
    </div>
    <div class="message inv-red-theme">
      {{ message }}
    </div>
    <button class="btn red-theme" @click="$emit('onEnter', true)">
      ENTRAR
    </button>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
}
</script>
