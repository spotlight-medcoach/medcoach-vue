<template>
<div id="historial">
  <div class="mb-3 titulo">Historial de Exámenes</div>
  <div v-if="history">
    <div v-if="history.length === 0">
      <p>No ha ralizado exámenes</p>
    </div>
    <div v-for="(item, index) in history" :key="`history-${index}`" class="carta mb-3">
      <div class="div-text">
        <div class="topic mb-2">Examen {{ item.index }}</div>
        <div class="subtopic">{{ item.date }} - Cantidad de preguntas: {{ item.total_questions }}</div>
      </div>
      <div class="d-flex finished" v-if="item.finished">
        <div class="percent">
          {{ parseFloat(item.score).toFixed(0) }}%
        </div>
        <div class="link">
          <div class="boton" @click="goToCustomTestRetro(item.id)"> Ver Resultado </div>
        </div>
      </div>
      <div class="d-flex" v-else>
        <div class="d-flex align-items-center pendiente">Pendiente</div>
        <div class="link">
          <div class="boton" @click="goToCustomTest(item.id)">Volver al examen</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="d-flex align-items-center">
      <div>
        <div class="d-flex justify-content-around" style="font-size: 20px;">
          Cargando...
        </div>
        <div class="d-flex justify-content-around mt-3">
          <img src="@/assets/icons/loading.svg" width="50" />
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'test-history',
  computed: {
    ...mapGetters({
      history: 'custom_test/history'
    })
  },
  methods: {
    goToCustomTest (customTestId) {
      this.$router.push({ path: '/custom_test', query: { custom_test_id: customTestId } })
    },
    goToCustomTestRetro (customTestId) {
      this.$router.push({ path: '/custom_test_retro', query: { custom_test_id: customTestId } })
    }
  }
}
</script>
<style lang="scss">
  #historial{
    border-top: 3px solid;
    margin-top: 1.2rem;
    width: 100%;
    padding: 1rem;
    .pendiente {
      font-style: italic;
      font-size: 1.1rem;
    }
    .titulo {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .carta {
      display: flex;
      justify-content: space-between;
      box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.25);
      border-radius: 12px;
      padding: 8px 15px;
      .percent {
        align-items: center;
        display: flex;
        font-size: 2rem;
        font-style: medium;
        font-weight: 500;
      }
      .link {
        align-items: center;
        display: flex;
        font-size: 1rem;
        margin-left: 3rem;
        .boton {
          border-radius: 7px;
          padding: 10px;
          border: 2px solid #FE9501;
          font-weight: 700;
          cursor: pointer;
          background-color: #FE9501;
          color: white;
        }
      }
      .finished {
        .boton {
          background-color: white;
          color: #FE9501;
        }
      }
      .boton:hover {
        text-decoration: underline;
      }
    }
    .topic {
      font-weight: bolder;
      font-size: 1.5rem;
    }
    .subtopic {
      font-size: 1rem;
    }
  }
</style>
