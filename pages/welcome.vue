<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-8 is-offset-2 mt-10">
          <horizontal-stepper
            :steps="steps"
            @completed-step="completeStep"
            @active-step="isStepActive"
            @stepper-finished="finishWelcome"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import jwtDecode from 'jwt-decode'
import HorizontalStepper from '../components/HorizontalStepper'
import Welcome from '../components/Welcome'
import StudyPlans from '../components/StudyPlans'
import DiagnosticTest from '../components/DiagnosticTest'
export default {
  name: 'Welcome',
  components: {
    HorizontalStepper
  },
  data () {
    return {
      steps: [
        {
          icon: '',
          name: 'first',
          title: 'Bienvenida',
          component: Welcome,
          completed: true,
          alwaysActive: true

        },
        {
          icon: 'a',
          name: 'second',
          title: 'Plan de estudio',
          component: StudyPlans,
          completed: true
        },
        {
          icon: '',
          name: 'third',
          title: 'Examen de diagnóstico',
          component: DiagnosticTest,
          completed: true,
          alwaysActive: true
        }
      ],
      plan_selected: null
    }
  },

  created () {
    const token = this.$route.query.token
    if (token !== undefined) {
      const decoded = jwtDecode(token)
      console.log('Decoded:', decoded)
      if (process.client) {
        localStorage.setItem('studentData', JSON.stringify(decoded))
        localStorage.setItem('usertoken', token)
      }
    } else {
      this.$router.push({ path: '/' })
    }
  },
  mounted () {
  },
  methods: {
    completeStep (payload) {
      this.steps.forEach((step) => {
        if (step.name === payload.name) {
          step.completed = true
        }
      })
    },
    // Executed when @active-step event is triggered
    isStepActive (payload) {
      this.steps.forEach((step) => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false
          }
        }
      })
    },
    // Executed when @stepper-finished event is triggered
    finishWelcome (payload) {
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      // alert('end')
      // loading
      this.$axios
        .post('/students/diagnostic',
          {
            first: true
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          console.log('Response:', response)
          // redireccionar a diagnostic/test
        })
        .catch((err) => {
          console.log('Error:', err)
        })
    }
  }
}
</script>
<style>
.mt-10 {
    margin-top: 8rem !important;
}
.content{
  margin: 150px;
  text-align: justify;
  font-family: Avenir;
  line-height: 2em;
}
.btn-primary {
    background-color: #FC9326;
    border-color: #FC9326;
}

.btn-primary:hover {
    background-color: #fc8200;
    border-color: #fc8200;
}
.stepper-box {
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0.12), 0 0px 0px rgba(0, 0, 0, 0.24) !important;
}
.divider-line {
    top: 36px;
}
</style>
