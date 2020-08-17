<template>
<div align="left">
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
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import ManualCard from '@/components/ManualCard'

export default {
  name: 'dashboard-calendar',
  components: {
    ManualCard
  },
  data () {
    moment.locale('es')
    return {
      currentMonth: this.capitalizeFirstLetter(moment().format('MMMM')),
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
          day: 'Miércoles',
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
          day: 'Sábado',
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
      ]
    }
  },
  created () {
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
      element.data = this.syllabus.days[index].manuals
      element.index = this.syllabus.days[index].index
      element.reviewed = this.syllabus.days[index].reviewed
      element.number = days[index]
    })
  },
  methods: {
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  computed: {
    ...mapState(['syllabus'])
  }
}
</script>
