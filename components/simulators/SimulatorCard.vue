<template>
<div
 :class="['simulator',
  simulator.finished ? 'finalizado' : 'pendiente'
 ]">
    <div class="d-flex">
        <div class="content">
        <h3 :class="simulator.finished ? 'text-finalizado' : 'text-pendiente'">Exámenes simuladores</h3>
        <h4 v-if="simulator.finished">Finalizado</h4>
        <h4 style="color:#fff" v-else>Pendiente</h4>
        </div>
        <b-button class="buttontest" v-if="simulator.finished === false" v-on:click="gotoSimulator">Tomar examen</b-button>
        <b-button class="buttonfeedback" v-if="simulator.finished === true" v-on:click="gotoResults">Ver retroalimentación</b-button>
    </div>
</div>
</template>
<script>
export default {
  props: {
    simulator: {
      type: Object,
      required: true
    }
  },
  created () {
    console.log(this.simulator.finished)
  },
  methods: {
    gotoSimulator () {
      localStorage.setItem('setSimulator', this.simulator.id)
      this.$router.push({ path: `/introduction_simulator/?id=${this.simulator.id}` })
    },
    gotoResults () {
      localStorage.setItem('setSimulator', this.simulator.id)
      this.$router.push({ path: `/simulator_results/?id=${this.simulator.id}` })
    }
  }
}
</script>
<style>
    .simulator {
        margin: 10px;
        padding: 5px;
        width:100%;
        height:100px;
        border-radius:20px;
    }

    .finalizado {
        background-color: #fff;
        border-style:solid;
    }

    .pendiente {
        background-color: #000;
    }

    .content{
        margin: 10px 50px 5px 20px;
        width: 80%;
    }
    .buttontest{
        margin: 10px;
        background-color:#FE9400;
        width:175px;
        height:50px;
    }
    .text-finalizado{
      color:#000;
    }
    .text-pendiente{
      color:#fff;
    }
    .buttonfeedback{
      height:65px;
      background-color: #fff;
      color:#000;
      line-height: 1;
      border-width:thin;
      border-color:#000;
    }
</style>
