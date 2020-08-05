<template>
    <div class="return">
        <div class="d-flex">
        <b-button v-on:click="back()" style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;">
            <b-icon-chevron-left style="color:#FE9400; width:25px; height:25px;"></b-icon-chevron-left>
        <b>Regresar</b>
        </b-button>
        </div>
        <div class="simulators">
          <h1>Exámenes</h1>
          <div class="simulators" v-for="item in simulators" :key="item.simulador">
            <SimulatorCard v-bind:simulator="item"></SimulatorCard>
          </div>
        </div>
    </div>
</template>
<script>

import SimulatorCard from '../components/simulators/SimulatorCard.vue'

export default {
  components: {
    SimulatorCard
  },
  data () {
    return {
      simulators: []
    }
  },
  props: {
    // ...
  },
  created () {
    let token = ''
    if (process.client) {
      token = localStorage.getItem('usertoken')
    }
    this.$axios.get('/student/simulators', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      this.simulators = res.data.simulators
      console.log(this.simulators)
    })
  },
  methods: {
    back () {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>
<style>
 .return {
    margin: 30px;
  }
  .simulators {
    margin: 30px;
  }
</style>
