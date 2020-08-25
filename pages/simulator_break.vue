<template>
<div>
<div class="container">
<h1>Examen Simulador</h1>
</div>
<div class="container">
<h1>Hora de descansar, tiempo restante:</h1>
<h1>{{this.count}}</h1>
</div>
</div>
</template>
<script>
import moment from 'moment/moment'

export default {
  data () {
    return {
      count: ''
    }
  },
  created () {
    this.load_questions()
    const simulator = JSON.parse(localStorage.getItem('simulator'))
    this.questions = simulator.questions
    const StartBlock = parseInt(localStorage.getItem('start_break'))
    const date = moment(StartBlock)
    const today = moment()
    const milliseconds = today.diff(date, 'milliseconds')
    const time = 7200000 - milliseconds
    let duration = moment.duration(time, 'milliseconds')
    this.countdown = setInterval(() => {
      duration = moment.duration(duration - 1000000, 'milliseconds')
      this.count = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
      if (duration.asMilliseconds() <= 0) {
        localStorage.setItem('start_block2', moment.now())
        this.$router.push({ path: `/simulator_block2/?id=${this.$route.query.id}` })
      }
    }, 1000)
  },
  methods: {
    load_questions () {
      this.$axios.get(`/student/simulators/get?simulator_id=${this.$route.query.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('usertoken')}`
        }
      }).then((res) => {
        const day = moment.now()
        const simulator = {
          id: this.$route.query.id,
          cases: res.data.cases,
          questions: res.data.questions,
          start_first_block: day,
          start_break: null,
          start_second_block: null
        }
        const answers = new Array(200).fill(0)
        localStorage.setItem('answers', answers)
        localStorage.setItem('simulator', JSON.stringify(simulator))
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style>
.container{
    text-align:center;
    margin-top:30px;
}
</style>
