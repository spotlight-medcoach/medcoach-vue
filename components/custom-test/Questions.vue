<template>
<div id="questions" class="">
  <h3 class="text-center my-5">Examen Personalizado</h3>
  <div v-if="!custom_test">
    <loading-state message="Cargando las preguntas, por favor espere" height="50vh"/>
  </div>
  <div v-else class="mt-5 px-3 text-center w-100">
    <div
      :class="{'answered': question.response}"
      class="circle text-center m-1 pointer"
      v-for="(question, index) in custom_test.questions"
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
  props: ['custom_test'],
  name: 'questions',
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
  #questions {
    .circle {
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
