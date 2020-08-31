<template>
  <div>
    <div class="container">
      <h1>Examen Simulador</h1>
    </div>
    <div class="container">
      <h1>Hora de descansar, tiempo restante:</h1>
      <h1>{{this.count}}</h1>
    </div>
    <b-modal id="modal-1" hide-footer hide-header  no-close-on-backdrop no-close-on-esc>
    <p class="title text-center" style="font-size:24px"><b>Finalizando bloque</b></p>
    <div class="text-center mb-4">
      <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
    </div>
  </b-modal>
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
    const simulator = JSON.parse(localStorage.getItem('simulator'))
    this.questions = simulator.questions
    const StartBlock = parseInt(localStorage.getItem('start_break'))
    const date = moment(StartBlock)
    const today = moment()
    const milliseconds = today.diff(date, 'milliseconds')
    const time = 7200000 - milliseconds
    let duration = moment.duration(time, 'milliseconds')
    this.countdown = setInterval(() => {
      duration = moment.duration(duration - 1000, 'milliseconds')
      this.count = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
      if (duration.asMilliseconds() <= 0) {
        this.$bvModal.show('modal-1')
        clearInterval(this.countdown)
        this.$axios.put(`/student/simulators/break?simulator_id=${this.$route.query.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('usertoken')}`
          }
        }).then((res) => {
          this.load_questions()
        })
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
          start_first_block: null,
          start_break: null,
          start_second_block: day
        }
        const answers = new Array(200).fill(0)
        localStorage.setItem('answers', answers)
        localStorage.setItem('simulator', JSON.stringify(simulator))
        localStorage.setItem('start_second_block', moment.now())
        this.$router.push({ path: `/simulator_block2/?id=${this.$route.query.id}` })
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
