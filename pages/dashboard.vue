<template>
  <div id="dashboard">
    <b-overlay class="main-container-dashboard mt-5">
      <!-- QUOTE -->
      <div class="shadow-sm p-2 m-3 bg-white">
        <div class="about quote" align="center">
          <div>"{{ quoteSelected.quote }}"</div>
          <div class="author">
            - {{ quoteSelected.author }}
          </div>
        </div>
      </div>
      <!-- PHASE PROGRESS BAR -->
      <div v-if="phase.id">
        <div class="shadow-sm p-4 m-3 bg-white">
          <phases-index />
        </div>
      </div>
      <!-- CALENDAR -->
      <div v-if="onHttpRequest" class="w-100">
        <loading-state :message="message" height="60vh" />
      </div>
      <div v-else-if="errorHttp" class="about quote" align="center">
        <p>Estamos diseñando tu plan de estudios personalizado, refresca la página en un momento, disculpa las molestias</p>
      </div>
      <div v-else>
        <div class="shadow-sm p-4 m-3 bg-white">
          <second-phase v-if="alert_second_stage" />
          <third-phase v-else-if="alert_third_stage" />
          <dashboard-calendar v-else />
        </div>
      </div>
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
import { quotes } from '@/assets/json/quotes.json'

export default {
  components: {
    PhasesIndex,
    LoadingState,
    DashboardCalendar,
    SecondPhase,
    ThirdPhase
  },
  layout: 'new_default',
  data () {
    return {
      quos: quotes,
      quoteSelected: {
        author: '',
        quote: ''
      }
    }
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
  },
  created () {
    const size = this.quos.length
    if (size > 0) {
      const index = this.getRandomInt(0, size)
      this.quoteSelected = this.quos[index]
    }
  },
  methods: {
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    }
  }
}
</script>
