<template>
<b-container class="mt-5">
  <b-row class="text-center mt-5" v-if="manuals_not_found">
    <b-col class="mt-5">
      <h3>No se encontraron resultados</h3>
    </b-col>
  </b-row>
  <b-row v-else>
    <b-col cols="3">
      <div class="containerProgress py-3 px-2">
        <ManualsProgress  @clicked="onClickChild" :data='manualData' :manuals="allManuals"/>
      </div>
    </b-col>
    <b-col cols="9">
      <b-row>
        <b-col cols="3"><ManualsSubTopics @clicked="onRecieveSubtopicId" :subTopics='subTopics' :data='manualData'/></b-col>
        <b-col cols="9"><ManualsStudyGuide :allManuals='allManuals' :topicId='topicId' :subTopicId='subTopicId'/></b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import * as data from '@/components/manuals/manualsData.json'
import ManualsProgress from '@/components/manuals/manualsProgress.vue'
import ManualsSubTopics from '@/components/manuals/ManualsSubTopics.vue'
import ManualsStudyGuide from '@/components/manuals/ManualsStudyGuide.vue'

export default {
  components: {
    ManualsProgress,
    ManualsSubTopics,
    ManualsStudyGuide
  },
  data () {
    return {
      manualData: data.topics,
      topicId: '5ed038cc92a9db000d105e0c',
      subTopics: '',
      studyGuide: '',
      subTopicId: '5da179c60269b7000d16e46c',
      allManuals: [],
      manuals_not_found: false
    }
  },
  async created () {
    const response = await this.getAllManuals()
    console.log(response)
    this.topicId = this.manualData[0]._id
  },
  methods: {
    getAllManuals () {
      return this.$axios
        .get('/topics', {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((res) => {
          this.allManuals = res.data.topics
          console.log('Manuals')
        })
        .catch((err) => {
          console.log(err)
          this.manuals_not_found = true
        })
    },
    onClickChild (name, id) {
      console.log(name, id)
      const searchTopic = this.manualData.filter(elm => elm.name === name)
      this.subTopics = searchTopic
      this.topicId = id
    },
    onRecieveSubtopicId (id) {
      this.subTopicId = id
    }
  }
}
</script>

<style scoped>
.containerProgress{
  -webkit-box-shadow: 0 0 8px black;
  box-shadow: 0 0 8px black;
  border-radius: 20px;
}
@media (min-width: 1200px) {
  .container {
    max-width: 97vw !important;
  }
}
</style>
