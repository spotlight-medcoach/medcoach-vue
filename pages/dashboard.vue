<template>
  <div>
    <b-overlay :show="show" class="main-container-dashboard mt-5">
      <div class="about" align="center">
        <h6>"I put my heart and my soul into my work, and have lost my mind in the process"</h6>
        <h6><b>- Vincent van Gogh</b></h6>
      </div>
      <div v-show="phase.id" class="mt-5">
        <phases-index :student="student" :phase="phase" />
      </div>
      <b-container>
        <div class="pb-5" v-if="load">
          <div class="mt-5 d-flex justify-content-around" style="font-size: 28px;">
            {{ message_load }}
          </div>
          <div class="mt-5 d-flex justify-content-around">
            <img src="@/assets/loading.svg" width="100" />
          </div>
        </div>
        <div class="pb-5" v-else-if="second_stage">
          <div class="mt-5 d-flex justify-content-around">
            <div class="text-center">
              <h3 class="mb-4" style="font-weight: bolder">¡Felicidades!</h3>
              <h5 class="mb-4">Entraste a la segunda fase de tu plan de estudios.</h5>
              <p class="mb-4">Haz tu examen diagnóstico para organizar el contenido dependiendo de tus fortalezas.</p>
              <b-button variant="primary" @click="goToSecondStage">Hacer examen diagnóstico</b-button>
            </div>
          </div>
        </div>
        <div class="pb-5" v-else-if="third_stage">
          <div class="mt-5 d-flex justify-content-around">
            <div class="text-center">
              <h3 class="mb-4" style="font-weight: bolder">¡Comienza tu último repaso!</h3>
              <h5 class="mb-4">Este es el repaso general de todos los temas ya vistos.</h5>
              <p class="mb-4">En esta etapa repasarás los temas más importantes para el ENARM</p>
              <b-button variant="primary" @click="goToThirdStage">Presiona el botón para comenzar tu fase 3</b-button>
            </div>
          </div>
        </div>
        <div align="left" v-else>
          <h3><b>{{ currentMonth }}</b></h3>
          <b-row
            cols="7"
            cols-sm="12"
            cols-md="12"
            cols-lg="12"
            align="left"
            :no-gutters="true">
            <b-col>
              <div style="display:flex" align="center">
                <div v-for="day in week" :key="day.number" class="day">
                  <div
                    :class="[
                        day.index == 0 ? 'today' : ''
                    ]">
                    <p>{{day.day}}</p>
                    <p>{{day.number}}</p>
                  </div>
                  <manual-card
                    v-for="(item,index) in day.data"
                    :key="index"
                    :manual="item"
                    :today="day.index == 0"
                  >
                  </manual-card>
                  <hr v-if="day.reviewed && day.reviewed.length" style="border-color: black;" />
                  <manual-card
                    v-for="(item,index) in day.reviewed"
                    :key="'reviewed' + index"
                    :manual="item"
                    :today="day.index == 0"
                    :review="true"/>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
      </b-container>
    </b-overlay>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
import ManualCard from '../components/ManualCard'
import PhasesIndex from '@/components/phases/phasesIndex.vue'

export default {
  components: {
    ManualCard,
    PhasesIndex
  },
  data () {
    moment.locale('es')
    return {
      load: true,
      value: 33.333333333,
      max: 50,
      free_day: 0,
      show: false,
      currentMonth: this.capitalizeFirstLetter(moment().format('MMMM')),
      studentSyllabus: [],
      student: {
        free_day: null,
        end_date: null,
        test_date: null
      },
      phase: {
        id: null,
        progress: 0,
        total: 0,
        init_date_phase_2: null
      },
      week: [
        {
          day: 'Lunes',
          number: null,
          index: null,
          data: [],
          reviewed: []
        },
        {
          day: 'Martes',
          number: null,
          index: null,
          data: [],
          reviewed: []
        },
        {
          day: 'Miercoles',
          number: null,
          index: null,
          data: [],
          reviewed: []
        },
        {
          day: 'Jueves',
          number: null,
          index: null,
          data: [],
          reviewed: []
        },
        {
          day: 'Viernes',
          number: null,
          index: null,
          data: [],
          reviewed: []
        },
        {
          day: 'Sabado',
          number: null,
          index: null,
          data: [],
          reviewed: []
        },
        {
          day: 'Domingo',
          number: null,
          index: null,
          data: [],
          reviewed: []
        }
      ],
      day: null,
      second_stage: false,
      daysDisabled: [0, 0, 0, 0, 0, 0, 0],
      message_load: 'Cargando calendario, por favor espere'
    }
  },
  created () {
    this.getStudentSyllabus()
    this.getNumberDay()
  },
  methods: {
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    getStudentSyllabus () {
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      const now = moment()
      let day = now.day()
      day = day - 1
      if (day < 0) {
        day = 6
      }
      this.day = day
      const minDay = 0 - day
      const maxDay = minDay + 6
      this.$axios
        .get('/students/info', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          const data = res.data
          this.student = data.student
          this.daysDisabled[this.student.free_day] = 1
          return this.$axios
            .post('/students/syllabus', {
              min_index: minDay,
              max_index: maxDay,
              days_disabled: this.daysDisabled
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
        })
        .then((res) => {
          const data = res.data
          this.phase.id = data.phase
          this.phase.progress = data.progress
          this.phase.total = data.total
          this.phase.init_date_phase_2 = data.start_phase_two
          console.log('SILLABUS', data.days)
          this.studentSyllabus = data.days
          this.week.forEach((element, index) => {
            element.data = this.studentSyllabus[index].manuals
            element.index = this.studentSyllabus[index].index
            element.reviewed = this.studentSyllabus[index].reviewed
          })
          const today = data.days.find(day => day.index === 0)
          if (!today.manuals.length && this.day !== this.student.free_day) {
            this.second_stage = true
          }
          this.load = false
        })
        .catch((err) => {
          if (err.response.status === 401 || err.response.status === 402 || err.response.status === 403) {
            // this.$router.push({path: '/' });
          }
        })
    },
    getNumberDay () {
      const today = moment()
      let dayOfWeek = moment().day()
      dayOfWeek -= 1
      if (dayOfWeek < 0) {
        dayOfWeek = 6
      }
      const minIndex = 0 - dayOfWeek
      const maxIndex = minIndex + 6
      const days = []
      for (let i = minIndex; i < 0; i++) {
        days.push(moment(today).subtract(Math.abs(i), 'days').format('D'))
      }
      days.push(today.format('D'))
      for (let i = 1; i <= maxIndex; i++) {
        days.push(moment(today).add(i, 'days').format('D'))
      }
      this.week.forEach((element, index) => {
        element.number = days[index]
      })
    },
    goToManual (id) {
      this.$router.push({ path: '/manual', query: { manual_id: id } })
    },
    goToSecondStage () {
      this.message_load = 'Preparando examen'
      this.load = true
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      this.$axios
        .post('/students/diagnostic',
          {
            first: false
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          console.log('Response:', response)
          this.$router.push({ path: '/diagnostic_test' })
        })
        .catch((err) => {
          console.log('Error:', err)
          this.test_error = true
        })
    },
    goToThirdStage () {
      this.phase.id = 3
      return true
    }
  },
  computed: {
    third_stage () {
      if (this.rest_days && this.rest_days <= this.phase_3_days && this.phase.id !== 3) {
        return true
      } else {
        return false
      }
    },
    ...mapState(['rest_days', 'phase_3_days'])
  }
}
</script>
<style>
.bottomBorder{
  border-bottom:1px solid;
}
@media (min-width: 1200px) {
  .container {
    max-width: 97vw !important;
  }
}

.day {
  width: 14%!important;
}

.today {
  color: #FC9326;
  font-weight: 900;
}
</style>
