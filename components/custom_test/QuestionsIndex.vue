<template>
<div id="questions-index" class="">
  <h3 class="text-center my-5">Examen Personalizado</h3>
  <div v-if="!custom_test">
    <loading-state message="Cargando las preguntas, por favor espere" height="50vh"/>
  </div>
  <div v-else class="mt-5 px-3 text-center w-100">
    <div
      v-for="(question, index) in custom_test.questions"
      class="square text-center m-1 pointer"
      :class="{'answered': retro && question.response === question.correct_answer}"
      @click="goToCase(question.case_id)"
      :key="`question-${index}`">
      {{ index+1 }}
    </div>
  </div>
</div>
</template>
<script>
import LoadingState from '@/components/LoadingState.vue'
export default {
  props: ['custom_test', 'retro'],
  name: 'questions-index',
  components: {
    LoadingState
  },
  methods: {
    goToCase (caseId) {
      this.$store.commit('custom_test/setCaseId', caseId)
    }
  }
}
</script>
<style lang="scss">
  #questions-index {
    .square {
      width: 25px;
      heigth: 25px;
      border-radius: 5px;
      background-color: #FF4444;
      display: inline-block;
    }
    .answered {
      background-color: #00C851;
    }
  }
</style>
