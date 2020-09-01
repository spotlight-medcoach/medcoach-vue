<template>
<div id="simulator_results" class="container">
  <div class="d-flex justify-content-between my-4">
    <b-button v-on:click="back()" style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;">
      <b-icon-chevron-left style="color:#FE9400; width:25px; height:25px;"></b-icon-chevron-left>
      <b>Regresar</b>
    </b-button>
  <b-button v-on:click="feedback()" style="background-color:#fff; color:#FE9400;font-size:18px; border-style:none;">
    <b>Ir a retroalimentación</b>
    <b-icon-chevron-right style="color:#FE9400; width:25px; height:25px;"></b-icon-chevron-right>
  </b-button>
  </div>
  <div class="title">
    <h1>RESULTADO</h1>
  </div>
  <div class="d-flex justify-content-center">
    <div class="table">
      <div class="bg-orange">
        <p><b>Total preguntas correctas</b></p>
      </div>
      <div>
        <p>{{this.correct_answers}}</p>
      </div>
    </div>
    <div class="table">
      <div class="bg-orange">
        <p><b>Puntaje total (/100)</b></p>
      </div>
      <div>
        <p>{{this.result}}</p>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center">
    <div class="question_results" v-for="item in topics" :key="item.topic">
      <simulatorResultCard v-bind:topic="item"></simulatorResultCard>
    </div>
  </div>
  <div class="justify-content-center">
    <div class="question_results" v-for="item in topics" :key="item.topic">
      <simulatorResultTopic v-bind:topic="item"></simulatorResultTopic>
    </div>
  </div>
  <div class="d-flex justify-content-center">
    <div class="question_results" v-for="item in questions_by_type" :key="item.topic">
      <simulatorResultType v-bind:topic="item"></simulatorResultType>
    </div>
  </div>
  <b-modal id="modal-1"  hide-footer hide-header no-close-on-backdrop size="sm">
     <div class="popup">
        <p>Cargando resultados</p>
        <img class="image" src="@/assets/simulator_loading.svg" width="70" height="70">
      </div>
  </b-modal>
</div>
</template>
<script>
import simulatorResultCard from '../components/simulators/simulatorResultCard.vue'
import simulatorResultTopic from '../components/simulators/simulatorResultTopic.vue'
import simulatorResultType from '../components/simulators/simulatorResultType.vue'

export default {
  components: {
    simulatorResultCard,
    simulatorResultTopic,
    simulatorResultType
  },
  data () {
    return {
      correct_answers: '',
      result: '',
      topics: [],
      questions_by_type: []
    }
  },
  props: {
    // ...
  },
  created () {
    if (localStorage.getItem('simulator')) {
      localStorage.removeItem('simulator')
    }
    this.$store.commit('simulators/initState')
    this.$axios.get(`/student/simulators/result?simulator_id=${this.$route.query.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('usertoken')}`
      }
    }).then((res) => {
      this.correct_answers = res.data.topics.total_correct
      this.result = res.data.topics.result.toFixed(2)
      this.topics = res.data.topics.questions_by_topic
      this.questions_by_type = res.data.topics.questions_by_type
    }).catch((err) => {
      console.log(err)
    })
    this.$axios.get(`/student/simulators/retro?simulator_id=${this.$route.query.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('usertoken')}`
      }
    }).then((res) => {
      const simulator = {
        id: this.$route.query.id,
        cases: res.data.cases,
        questions: res.data.questions
      }
      simulator.questions.forEach((question, index) => {
        question.index = index
      })
      localStorage.setItem('simulator_feedback', JSON.stringify(simulator))
      this.$store.commit('simulators/setSimulator', simulator)
      this.$bvModal.hide('modal-1')
    }).catch((err) => {
      console.log(err)
    })
  },
  mounted () {
    this.$bvModal.show('modal-1')
  },
  methods: {
    back () {
      this.$router.push({ path: '/simulators' })
    },
    feedback () {
      this.$router.push({ path: `/simulator_feedback/?id=${this.$route.query.id}` })
    }
  }
}
</script>
<style>
#simulator_results .title{
    background-color:#778FF2;
    text-align:center;
    color:white;
}
#simulator_results{
    margin: auto;
}
.table{
    border-style:solid;
    width:30%;
    text-align:center;
    border-width: thin;
}
.bg-orange{
    background-color:#FE9400;
    border-bottom-style:solid;
    border-width: thin;
}
.question_results{
  display: flex; /* or inline-flex */
  flex-direction: row;
}
.popup{
  text-align:center;
  font-size:20px;
}
</style>
