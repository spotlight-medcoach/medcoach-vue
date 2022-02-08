<template>
  <section id="case-timer" class="custom-card">
    <div>
      <span>Tiempo: </span>
      <span>{{ timerString }}</span>
    </div>
    <div class="d-flex align-items-center">
      <span class="mr-16px">Marcar pregunta</span>
      <ToggleSwitch
        v-model="mark"
      />
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
  components: {
    ToggleSwitch
  },
  data () {
    return {
      mark: false
    }
  },
  computed: {
    ...mapState({
      timerString: state => state.custom_test.timerString
    })
  }
}
</script>
<style lang="scss">
  #case-timer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 24px;
    font-size: 20px;
    line-height: 24px;
    width: 100%;
    label {
      margin-bottom: 0px;
    }
  }
</style>
