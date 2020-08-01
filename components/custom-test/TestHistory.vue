<template>
<div id="historial">
  <div class="mb-3" style="font-size: 1.5rem">Historial de exámenes</div>
  <div class="pl-3">
    <div v-for="(item, index) in history" :key="`history-${index}`" class="carta mb-3 pb-3">
      <div class="div-text">
        <div class="topic">Examen no.{{ index + 1 }}</div>
        <div class="subtopic">{{ item.date }} - Cantidad de preguntas: {{ item.total_questions }}</div>
      </div>
      <div class="percent">
        {{ parseFloat(item.score).toFixed(0) }}%
      </div>
      <div class="pointer link">
        Ver examen
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'test-history',
  computed: {
    ...mapState({
      history: state => state.custom_test.history
    })
  }
}
</script>
<style lang="scss">
  #historial{
    width: 100%;
    padding: 1rem;
    .carta {
      border-bottom: thin solid #c4c4c4;
      display: flex;
      .div-text {
        width: 65%;
      }
      .percent {
        width: 15%;
        align-items: center;
        display: flex;
        font-size: 1.2rem;
      }
      .link {
        width: 15%;
        align-items: center;
        display: flex;
        font-size: 1.2rem;
      }
    }
    .link:hover{
      color: blue;
      text-decoration: underline;
    }
    .topic {
      font-weight: bolder;
      font-size: 1.25rem;
    }
    .subtopic {
      font-size: 0.9rem;
    }
  }
</style>
