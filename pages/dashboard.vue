<template>
<div id="dashboard">
  <b-overlay class="main-container-dashboard mt-5">
    <!-- QUOTE -->
    <div class="about" align="center">
      <h6>"I put my heart and my soul into my work, and have lost my mind in the process"</h6>
      <h6><b>- Vincent van Gogh</b></h6>
    </div>
    <!-- PHASE PROGRESS BAR -->
    <div v-if="phase.id" class="mt-5">
      <phases-index  />
    </div>
    <!-- CALENDAR -->
    <b-container>
      <div class="w-100" v-if="onHttpRequest">
        <loading-state :message="message" height="60vh" />
      </div>
      <div v-else-if="errorHttp">
        <p>{{ message }}</p>
      </div>
      <div v-else>
        <second-phase v-if="alert_second_stage" />
        <third-phase v-else-if="alert_third_stage" />
        <dashboard-calendar v-else />
      </div>
    </b-container>
    <!-- END_CALENDAR -->
  </b-overlay>
</div>
</template>
<script>

import { mapState } from 'vuex'
import PhasesIndex from '@/components/phases/phasesIndex.vue'
import LoadingState from '@/components/LoadingState.vue'
import SecondPhase from '@/components/dashboard/SecondPhase.vue'
import ThirdPhase from '@/components/dashboard/ThirdPhase.vue'
import DashboardCalendar from '@/components/dashboard/DashboardCalendar.vue'

export default {
  components: {
    PhasesIndex,
    LoadingState,
    DashboardCalendar,
    SecondPhase,
    ThirdPhase
  },
  computed: {
    alert_third_stage () {
      if (this.rest_days && this.rest_days <= this.phase_3_days && this.phase.id !== 3) {
        return true
      } else {
        return false
      }
    },
    ...mapState({
      rest_days: 'rest_days',
      phase_3_days: 'phase_3_days',
      syllabus: 'syllabus',
      phase: 'phase',
      alert_second_stage: 'alert_second_stage',
      onHttpRequest: state => state.http_request.onHttpRequest,
      message: state => state.http_request.message,
      errorHttp: state => state.http_request.errorHttp
    })
  }
}
</script>
