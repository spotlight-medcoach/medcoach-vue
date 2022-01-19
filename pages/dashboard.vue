<template>
  <div v-if="onHttpRequest" class="w-100">
    <loading-state :message="message" height="60vh" />
  </div>
  <div v-else-if="errorHttp" class="about quote" align="center">
    <p>Estamos diseñando tu plan de estudios personalizado, refresca la página en un momento, disculpa las molestias</p>
  </div>
  <div id="dashboard" class="m-0 px-3" v-else><!--------------------------------------- MAIN CONTENT (LEFT) -->
    <article class="main-container">
      <!-- QUOTE -->
      <div class="shadow-sm py-2 my-3 bg-white d-flex align-items-center justify-content-center text-center about quote">
        <div>
          <span>"{{ quoteSelected.quote }}"</span>
          <span class="author">
            - {{ quoteSelected.author }}
          </span>
        </div>
      </div>
      <!-- PHASE PROGRESS BAR -->
      <div v-if="phase.id">
        <div class="shadow-sm p-4 my-3 bg-white">
          <phases-index />
        </div>
      </div>
      <!-- CALENDAR -->
      <div class="shadow-sm p-4 my-3 bg-white">
        <second-phase v-if="alert_second_stage" />
        <third-phase v-else-if="alert_third_stage" />
        <dashboard-calendar v-else />
      </div>
      <!-- END_CALENDAR -->
    </article>
    <!-- NOTIFICATIONS -->
    <article class="notifications-container shadow-sm p-3 mt-3 bg-white">
      <dashboard-notifications />
    </article>
    <!-- SIMULATORS -->
    <article class="simulators-container shadow-sm p-3 mb-3 bg-white">
      <dashboard-simulators />
    </article>
  </div>
</template>

<script>

import { mapState } from 'vuex'

import LoadingState from '@/components/LoadingState.vue'
import PhasesIndex from '@/components/phases/phasesIndex.vue'
import SecondPhase from '@/components/dashboard/SecondPhase.vue'
import ThirdPhase from '@/components/dashboard/ThirdPhase.vue'
import DashboardCalendar from '@/components/dashboard/DashboardCalendar.vue'

import DashboardNotifications from '@/components/dashboard/DashboardNotifications.vue'
import DashboardSimulators from '@/components/dashboard/DashboardSimulators.vue'

import { quotes } from '@/assets/json/quotes.json'

export default {
  components: {
    LoadingState,
    PhasesIndex,
    SecondPhase,
    ThirdPhase,
    DashboardCalendar,
    DashboardNotifications,
    DashboardSimulators
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
