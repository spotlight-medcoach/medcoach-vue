<template>
  <div class="mb-5">
    <div class="title">
      <h1>Examen Simulador</h1>
    </div>
    <div class="container">
      <div class="d-flex justify-content-between countdown mb-4">
        <h3>Primera parte</h3>
        <h3>{{this.count}}</h3>
      </div>
      <b-button v-on:click="gotoTest(index)" class="question" v-for="(item, index) in questions" v-bind:item="item" v-bind:key="item.id">{{index + 1}}</b-button>
      <div class="start">
        <b-button style="margin-right:28px;" width="100" class="bg-danger" v-on:click="startTest">Comenzar</b-button>
      <div>
    </div>
  </div>
  <b-modal id="modal-1" hide-footer hide-header  no-close-on-backdrop no-close-on-esc>
    <p class="title" style="font-size:24px"><b>Finalizando bloque</b></p>
    <div>
      <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
    </div>
  </b-modal>
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
    const StartBlock = parseInt(localStorage.getItem('start_first_block'))
    const date = moment(StartBlock)
    const today = moment()
    const milliseconds = today.diff(date, 'milliseconds')
    const time = 18000000 - milliseconds
    let duration = moment.duration(time, 'milliseconds')
    this.countdown = setInterval(() => {
      duration = moment.duration(duration - 1000, 'milliseconds')
      this.count = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
      if (duration.asMilliseconds() <= 0) {
        this.save_test()
      }
    }, 1000)
  },
  methods: {
    gotoTest (index) {
      clearInterval(this.countdown)
      localStorage.setItem('current_question', index)
      this.$router.push({ path: `/test_simulator/?id=${this.questions[index].case_id}` })
    },
    startTest () {
      this.$router.push({ path: `/test_simulator/?id=${this.questions[0].case_id}` })
    },
    save_test () {
      this.$bvModal.show('modal-1')
      clearInterval(this.countdown)
      const answer = this.answers.map(function (x) {
        return parseInt(x, 10)
      })
      this.$axios.put(`/student/simulators?simulator_id=${this.simulator_data.id}`, { answers: answer }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('usertoken')}`
        }
      }).then((res) => {
        localStorage.setItem('start_break', moment.now())
        this.$router.push({ path: `/simulator_break/?id=${this.$route.query.id}` })
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
    background-color: #FF4444;
    border-radius: 5px;
    border-style: none;
    height: 35px;
    margin-bottom: 10px;
    margin-left: 10px;
    padding: 0px;
    text-align:center;
    width: 35px;
    color: black;
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
