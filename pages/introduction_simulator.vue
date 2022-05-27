<template>
  <div class="return">
    <div>
      <b-button style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;" @click="back()">
        <b-icon-chevron-left style="color:#FE9400; width:25px; height:25px;" />
        <b>Regresar</b>
      </b-button>
    </div>
    <div class="title">
      <h1><b>Sobre los exámenes simuladores</b></h1>
    </div>
    <div class="text">
      <h6>Bienvenido al simulador ENARM</h6>
      <h6>Antes de comenzar debes considerar ciertos puntos para contestar tu examen.</h6>
      <h6>El formato que se presenta es muy similar a lo que encontrarás el día de tu Nacional, incluyendo la interfaz de usuario.</h6>
      <h6>Debes elegir un día donde te encuentres completamente libre, ya que la duración total del examen es alrededor de <b>5 horas.</b></h6>
      <h6>El examen se compone de <b>280 reactivos.</b><!--; 405 preguntas en español y 45 en inglés.--></h6>
      <!-- <h6>A su vez, se divide en dos bloques; el <b>bloque 1 tiene 250 reactivos</b> y tendrás un tiempo de </b>5 horas para contestarlo.</b></h6>
      <h6>Posteriormente, recibirás un periodo de </b>descanso de 1 hora.</b></h6>
      <h6>Después de las cuales iniciara automáticamente el <b>bloque 2 que consta de 200 reactivos</b> donde tendrás <b>4 horas </b> para contestarlo.</h6> -->
      <h6>Mucha suerte.</h6>
    </div>
    <div class="button">
      <b-button v-b-modal.modal-1 class="buttontest">
        Tomar examen
      </b-button>
      <b-modal id="modal-1" hide-footer hide-header class="return">
        <p class="title-modal" style="font-size:24px">
          <b>Confirmación</b>
        </p>
        <p class="title-modal">
          Escribe la palabra <b>ENARM</b> para comenzar tu examen
        </p>
        <b-input v-model="enarm" class="mb-4" />
        <p v-if="error" class="error">
          Error, ingresa la palabra <b>ENARM</b>
        </p>
        <div style="text-align:center">
          <b-button center-align class="comenzar" @click="gotoSimulator">
            Comenzar
          </b-button>
        </div>
      </b-modal>
      <b-modal id="modal-2" hide-footer hide-header no-close-on-backdrop no-close-on-esc>
        <p class="title-modal" style="font-size:24px">
          <b>Creando simulador, espere</b>
        </p>
        <div style="text-align: center;">
          <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>

import { prepareSimulator, prepareTest } from '@/assets/js/helper'

export default {
  data () {
    return {
      error: false,
      enarm: '',
      simulator_id: this.$route.query.id
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/simulators' })
    },
    gotoSimulator () {
      if (this.enarm === 'ENARM') {
        this.$bvModal.hide('modal-1')
        this.$bvModal.show('modal-2')

        this.$axios.post(`/student/simulators?simulator_id=${this.simulator_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('usertoken')}`
          }
        }).then(() => {
          this.$axios.get(`/student/simulators/get?simulator_id=${this.simulator_id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('usertoken')}`
            }
          }).then((res) => {
            const simulator = prepareSimulator(res, this.simulator_id)
            prepareTest(simulator)
            this.$router.push(`/simulator?simulator_id=${this.simulator_id}`)
          }).catch((err) => {
            console.log(err)
          })
        })
      } else {
        this.error = true
      }
    }
  }
}
</script>
<style lang="scss">
  .title-modal{
    margin-bottom: 45px;
    text-align:center;
  }
 .return {
    margin: 30px;
    .title{
      margin:30px;
      margin-bottom: 45px;
      text-align:center;
    }
    .text {
      width: 80%;
      margin: auto;
    }
    .buttontest{
      margin: 10px;
      background-color:#FE9400;
      font-size:18px;
    }
    .button{
      text-align:right;
      margin-right:200px;
    }
    .comenzar{
      margin:20px;
      background-color:#FE9400;
      width:150px;
    }
    .error{
      color:#FF4444;
    }
    .image{
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 50%;
      margin-bottom:20px;
    }
  }

  @media (min-width: 1600px) {
    .text {
      width: 60%;
    }
  }
</style>
