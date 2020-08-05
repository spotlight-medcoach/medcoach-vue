<template>
<div>
<div class="container">
<h1>Examen Simulador</h1>
</div>
<div class="container">
<h1>Hora de descansar, tiempo restante:</h1>
</div>
</div>
</template>
<script>
export default {
  data () {
    return {
      Hour: false
    }
  },
  Created () {
    localStorage.getItem('')
  },
  methods: {
  }
}
</script>
<style>
.container{
    text-align:center;
    margin-top:30px;
}
</style>
