<template>
  <div id="phases-progress">
    <b-skeleton-wrapper :loading="loading">
      <!-- PHASES LOADING -->
      <template #loading>
        <div>
          <b-skeleton width="40%" type="button" class="mb-5"></b-skeleton>
        </div>
        <div class="phases-container">
          <div>
            <b-skeleton width="40px"></b-skeleton>
            <b-skeleton width="100%"></b-skeleton>
            <b-skeleton width="300px"></b-skeleton>
          </div>
          <div>
            <b-skeleton width="40px"></b-skeleton>
            <b-skeleton width="100%"></b-skeleton>
            <b-skeleton width="200px"></b-skeleton>
          </div>
          <div>
            <b-skeleton width="40px"></b-skeleton>
            <b-skeleton width="100%"></b-skeleton>
            <b-skeleton width="400px"></b-skeleton>
          </div>
        </div>
      </template>
      <!-- END PHASES LOADING -->
    </b-skeleton-wrapper>
    <template v-if="!loading">
      <!-- PHASES CONTENT -->
      <div class="d-flex justify-content-between">
        <h3 class="header-md">Fase de estudio</h3>
        <div class="text-right">
          <h4 class="header-md">{{ restDays }} días restantes ENARM</h4>
          <p class="text-xs-content">Calculado al {{ moment_test_date.format('DD [de] MMMM [del] YYYY') }}</p>
        </div>
      </div>
      <div class="phases-container">
        <div class="my-2">
          <phases-phase :currentPhase="1" />
        </div>
        <div class="my-2">
          <phases-phase :currentPhase="2" />
        </div>
        <div class="my-2">
          <phases-phase :currentPhase="3" />
        </div>
      </div>
      <!-- EN PHASES CONTENT -->
    </template>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
import phasesPhase from './phasesPhase.vue'

export default {
  components: {
    phasesPhase
  },
  name: 'PhasesIndex',
  props: {
    loading: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    moment.locale('es')
    return {
      now: moment()
    }
  },
  computed: {
    restDays () {
      let days = 0
      days = this.moment_test_date.diff(this.now, 'days') // fecha_test - fecha_actual
      if (days < 0) {
        days = 0
      }
      this.$store.commit('setRestDays', days)
      return days
    },
    moment_test_date () {
      return moment(this.student.test_date)
    },
    ...mapState({
      student: 'studentInfo'
    })
  }
}
</script>
<style lang="scss">
  .phases-container {
    display: grid;
    grid-template-columns: 3fr 4fr 3fr;
    gap: 7px;
  }
</style>
