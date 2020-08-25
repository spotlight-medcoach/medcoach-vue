<template>
<div>
<div class="title">
<h1>Examen Simulador</h1>
</div>
<div class="container">
<div class="d-flex justify-content-between countdown">
<h3>Primera parte</h3>
<h3>{{this.count}}</h3>
</div>
<b-button v-on:click="gotoTest(index)" class="question" v-for="(item, index) in questions" v-bind:item="item" v-bind:key="item.id">{{index + 1}}</b-button>
<div class="start">
<b-button style="margin-right:28px;" width="100" class="bg-danger" v-on:click="startTest">Comenzar</b-button>
<div>
</div>
</div>
</div>
</div>
</template>
<script>
import moment from 'moment/moment'

export default {
  data () {
    return {
      questions: [],
      count: '',
      countdown: ''
    }
  },
  props: {
    // ...
  },
  created () {
    const simulator = JSON.parse(localStorage.getItem('simulator'))
    this.questions = simulator.questions
    const StartBlock = simulator.start_first_block
    const date = moment(StartBlock)
    const today = moment()
    const milliseconds = today.diff(date, 'milliseconds')
    const time = 18000000 - milliseconds
    let duration = moment.duration(time, 'milliseconds')
    this.countdown = setInterval(() => {
      duration = moment.duration(duration - 1000, 'milliseconds')
      this.count = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
      if (duration.asMilliseconds() <= 0) {
        localStorage.setItem('start_break', moment.now())
        this.$router.push({ path: `/simulator_break/?id=${this.$route.query.id}` })
      }
    }, 1000)
  },
  methods: {
    gotoTest (index) {
      clearInterval(this.countdown)
      localStorage.setItem('current_question', index)
      this.$router.push({ path: `/test_simulator/?id=${this.questions[index].id}` })
    },
    startTest () {
      this.$router.push({ path: `/test_simulator/?id=${this.questions[0].id}` })
    },
    save_test () {
      this.$axios.put(`/student/simulators?simulator_id=${this.simulator_data.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('usertoken')}`
        },
        data: {
          answers: this.answers
        }
      }).then((res) => {
        this.$router.push({ path: '/simulators' })
      })
    }
  }
}
</script>
<style>
.title{
    margin:50px;
    text-align:center;
}
.question{
    border-style:solid;
    margin-left:10px;
    margin-bottom:2px;
    width:50px;
    text-align:center;
    line-height: 1em;
}
.container{
  margin-top:50px;
}
.start{
  text-align:right;
}
.countdown{
  margin-right:28px;
  margin-left:10px;
}
.button-group{
text-align:center;
}
</style>
