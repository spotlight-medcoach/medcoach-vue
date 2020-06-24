<template>
  <div>
    <b-overlay :show="show" class="main-container-dashboard">
      <div class="about" align="center">
        <h6>"I put my heart and my soul into my work, and have lost my mind in the process"</h6>
        <h6><b>- Vincent van Gogh</b></h6>
      </div>
      <b-container class="bottomBorder">
        <b-row cols="12" cols-sm="12" cols-md="12" cols-lg="12" align="left">
          <b-col cols="10">
            <br>
            <h3><b>Fase 1</b></h3>
            <div align="left">
              <b-progress
                :value="value"
                :max="max"
                :precision="2"
                show-progress
                class="mb-3"
              ></b-progress>
              <div align="right">
                <h6><b>130 días</b></h6>
              </div>
            </div>
          </b-col>
          <b-col cols="2">
            <div align="center">
              <h1><b>260</b></h1>
              <p style="font-size:20px"><b>Días restantes</b></p>
              <p style="font-size:11px">Calculado al 22 de Septiembre</p>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <br/>
      <b-container>
        <div class="pb-5" v-if="load">
          <div class="mt-5 d-flex justify-content-around" style="font-size: 28px;">
            Cargando calendario, por favor espere
          </div>
          <div class="mt-5 d-flex justify-content-around">
            <img src="@/assets/loading.svg" width="100" />
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
            no-gutters=true>
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
                  >
                  </manual-card>
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
import ManualCard from '../components/ManualCard'
export default {
  components: {
    ManualCard
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
      week: [
        {
          day: 'Lunes',
          number: null,
          index: null,
          data: []
        },
        {
          day: 'Martes',
          number: null,
          index: null,
          data: []
        },
        {
          day: 'Miercoles',
          number: null,
          index: null,
          data: []
        },
        {
          day: 'Jueves',
          number: null,
          index: null,
          data: []
        },
        {
          day: 'Viernes',
          number: null,
          index: null,
          data: []
        },
        {
          day: 'Sabado',
          number: null,
          index: null,
          data: []
        },
        {
          day: 'Domingo',
          number: null,
          index: null,
          data: []
        }
      ]
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
      const minDay = 0 - day
      const maxDay = minDay + 6

      this.$axios
        .get('/students/info', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          return this.$axios
            .post('/students/syllabus', {
              min_index: minDay,
              max_index: maxDay,
              days_disabled: [0, 0, 0, 0, 0, 0, 0]
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
        })
        .then((res) => {
          const data = res.data.days
          console.log('SILLABUS', data)
          this.studentSyllabus = data
          this.week.forEach((element, index) => {
            element.data = this.studentSyllabus[index].manuals
            element.index = this.studentSyllabus[index].index
          })
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
      console.log('Today:', today.format('YYYY-MM-DD H:mm:ss'))
      console.log('Day of the week:', dayOfWeek)
      console.log('Days:', days)
      console.log(this.studentSyllabus)
      this.week.forEach((element, index) => {
        element.number = days[index]
      })
    },
    goToManual (id) {
      this.$router.push({ path: '/student_manual', query: { manual_id: id } })
    }
  },
  computed: {

  }
}
</script>
<style>
.main-container-dashboard {
  top: 150px;
}
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
