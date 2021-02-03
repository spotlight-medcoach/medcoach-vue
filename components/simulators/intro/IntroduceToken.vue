<template>
  <div>
    <form @submit.prevent="submitToken">
      <div>
        <label for="">TOKEN {{ session }}</label>
        <input type="text" v-model.trim="token">
      </div>
      <div>
        <label for="">REPETIR TOKEN {{ session }}</label>
        <input type="text" v-model.trim="repeat_token">
      </div>
      <button type="submit">ENTRAR</button>
    </form>
  </div>
</template>
<script>
export default {
  props: {
    session: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      token: '',
      repeat_token: ''
    }
  },
  methods: {
    submitToken() {
      let flag = true;
      this.$emit('onSubmit', flag);
    }
  }
}
</script>
