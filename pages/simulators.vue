<template>
  <div class="return">
    <div class="d-flex">
      <b-button style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;" @click="back()">
        <b-icon-chevron-left style="color:#FE9400; width:25px; height:25px;" />
        <b>Regresar</b>
      </b-button>
    </div>
    <div class="simulators">
      <h1>Exámenes</h1>
      <div v-for="item in simulators" :key="item.simulador" class="simulators">
        <SimulatorCard :simulator="item" />
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
  layout: 'default',
  props: {
    // ...
  },
  data () {
    return {
      simulators: []
    }
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
