<template>
  <div class="content">
    <div class="w-100 mb-5" v-if="this.study_plans.length === 0">
      <loading-state message="Cargando planes de estudio" height="40vh" />
    </div>
    <div class="row" v-else>
      <div class="col-sm-4" v-for="(plan, index) in study_plans" :key="plan._id">
        <b-card
            :id="plan._id"
            class="mb-2 mr-2 text-center"
            :class="[
                index == 0 ? 'blue-theme' : (index == 1 ? 'rose-theme' : 'orange-theme'),
                plan_selected != null && plan_selected._id == plan._id ? 'selected-item' : ''
            ]"
            :footer="plan_selected != null && plan_selected._id == plan._id ? 'PLAN SELECCIONADO' : 'SELECCIONAR PLAN'"
            @click="selectPlan(plan)"
        >
          <h3 class="card-title">{{ plan.name }}</h3>
          <span class="body" v-html="plan.description"></span>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
export default {
  name: 'study_plans',
  components: {
    LoadingState
  },
  created () {
    if (this.study_plans.length === 0) {
      this.$store.dispatch('welcome/getStudyPlans')
    }
  },
  computed: {
    ...mapState({
      study_plans: state => state.welcome.study_plans,
      plan_selected: state => state.welcome.plan_selected
    })
  },
  methods: {
    selectPlan (plan) {
      this.$store.dispatch('welcome/putStudyPlan', plan)
        .then(() => {
          this.$emit('can-continue', { value: true })
        })
    }
  }
}
</script>
<style>
.card-title {
    font-weight: bold;
}

.blue-theme {
    color: #1CA4FC;
}

.blue-theme > .card-footer {
    background-color: #1CA4FC;
    color: #fff;
}

.blue-theme.selected-item > .card-footer {
    background-color: #0083da;
    color: #fff;
}

.rose-theme {
    color: #ED62A7;
}

.rose-theme > .card-footer {
    background-color: #ED62A7;
    color: #fff;
}

.rose-theme.selected-item > .card-footer {
    background-color: #b30059;
    color: #fff;
}

.orange-theme {
    color: #FC9326;
}

.orange-theme > .card-footer {
    background-color: #FC9326;
    color: #fff;
}

.orange-theme.selected-item > .card-footer {
    background-color: #d16c00;
    color: #fff;
}

.body {
    text-align: initial;
    color: #000;
}

.card {
  border-radius: 22px !important;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.25);
  margin: 10px;
}

.card-title {
    margin-top: 1em;
}

.card-footer {
    letter-spacing: 5px;
    min-height: 70px;
    padding-top: 18px;
    cursor: pointer;
    border-radius: 0px 0px 22px 22px !important;
}
</style>
