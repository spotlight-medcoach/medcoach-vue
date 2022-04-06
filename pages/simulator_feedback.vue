<template>
  <div>
    <div class="d-flex">
      <b-button style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;" @click="back()">
        <b-icon-chevron-left style="color:#FE9400; width:25px; height:25px;" />
        <b>Regresar</b>
      </b-button>
    </div>
    <div class="title">
      <h1>Retroalimentación de examen Simulador</h1>
    </div>
    <div class="container">
      <div class="d-flex justify-content-between countdown" />
      <b-button v-for="(item, index) in questions" :key="item.id" class="question" :item="item" @click="gotoTest(index)">
        {{ index + 1 }}
      </b-button>
    </div>
  </div>
  </div>
  </div>
</template>
<script>

export default {
  props: {
    // ...
  },
  data () {
    return {
      questions: [],
      count: '',
      countdown: ''
    }
  },
  created () {
    const simulator = JSON.parse(localStorage.getItem('simulator_feedback'))
    this.questions = simulator.questions
  },
  methods: {
    gotoTest (index) {
      clearInterval(this.countdown)
      localStorage.setItem('current_feedback_question', index)
      this.$router.push({ path: `/simulator_feedback_question/?id=${this.questions[index].case_id}` })
    },
    back () {
      this.$router.push({ path: `/simulator_results/?id=${this.$route.query.id}` })
    }
  }
}
</script>
<style>
.title{
    margin-bottom:50px;
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
