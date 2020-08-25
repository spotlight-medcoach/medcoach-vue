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
    <b-modal id="modal-1" hide-footer hide-header no-close-on-backdrop size="sm">
      <div class="popup">
        <p>Cargando exámenes</p>
        <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
      </div>
    </b-modal>
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
      this.$bvModal.hide('modal-1')
    })
  },
  mounted () {
    this.$bvModal.show('modal-1')
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
  .popup{
   text-align:center;
   font-size:20px;
  }
  .image{
     display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  margin-bottom:20px;
  }
</style>
