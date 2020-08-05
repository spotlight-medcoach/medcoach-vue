<template>
<div>
<div class="title">
<h1>Examen Simulador</h1>
</div>
<div class="container">
<b-button v-on:click="gotoTest(index)" class="question" v-for="(item, index) in questions" v-bind:item="item" v-bind:key="item.id">{{index + 1}}</b-button>
<div class="start">
<b-button width="100" class="bg-danger" v-on:click="startTest">Comenzar</b-button>
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
    const seconds = today.diff(date, 'seconds')
    const time = 18000 - seconds
    console.log(time)
    const duration = moment({ seconds: time })
    this.countdown = setInterval(() => {
      // time = time - 1000
      this.count = duration.format('hh:mm:ss')
      console.log(this.count)
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
    width:40px;
    text-align:center;
}
.container{
  margin-top:50px;
}
.start{
  text-align:right;
}
</style>
