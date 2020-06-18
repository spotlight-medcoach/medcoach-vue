<template>
  <div class="content">
    <div class="row">
      <div v-if="loading">Cargando</div>
      <div class="col-sm-4" v-for="(plan, index) in study_plans" :key="plan._id">
        <b-card
            :id="plan._id"
            class="mb-2 mr-2 text-center"
            :class="[
                index == 0 ? 'blue-theme' : (index == 1 ? 'rose-theme' : 'orange-theme'),
                plan_selected != null && plan_selected._id == plan._id ? 'selected' : ''
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
export default {
  name: 'study_plans',
  components: {
  },
  data () {
    return {
      study_plans: [],
      loading: false,
      plan_selected: null
    }
  },
  created () {
    this.loading = true
    this.loadStudyPlans()
  },
  methods: {
    loadStudyPlans () {
      this.$axios
        .get('/studyplans')
        .then((response) => {
          console.log('Response:', response)
          this.study_plans = response.data
          this.loading = false
        })
        .catch((err) => {
          console.log('Error:', err)
        })
    },
    selectPlan (plan) {
      let token
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      console.log('Plan selected:', plan)
      this.plan_selected = plan
      this.$axios
        .put('/students/studyplan',
          {
            study_plan: plan._id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          console.log('Response:', response)
        })
        .catch((err) => {
          console.log('Error:', err)
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

.blue-theme.selected > .card-footer {
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

.rose-theme.selected > .card-footer {
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

.orange-theme.selected > .card-footer {
    background-color: #d16c00;
    color: #fff;
}

.body {
    text-align: initial;
    color: #000;
}

.card {
    border-radius: 30px!important;
}

.card-title {
    margin-top: 1em;
}

.card-footer {
    border-radius: 0 0 30px 30px!important;
    letter-spacing: 5px;
    min-height: 70px;
    padding-top: 18px;
    cursor: pointer;
}
</style>
