<template>
  <div>
    Hola Mundo
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      test: 'simulators/test'
    })
  },
  methods: {

  },
  created () {

  }
}
</script>
