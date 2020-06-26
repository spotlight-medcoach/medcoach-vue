<template>
<div style="margin-top:200px">
    <b-container>
    <b-row class="text-center">
        <b-col class="containerProgress"><ManualsProgress  @clicked="onClickChild" :data='manualData'/></b-col>
        <b-col cols="8"><ManualsSubtopics @clicked="onRecieveSubtopicId" :subTopics='subTopics' :data='manualData'/></b-col>
        <b-col cols="8"><ManualsStudyGuide :allManuals='allManuals' :data='manualData' :topicId='topicId' :subTopicId='subTopicId' :isNotesComponent='isNotesComponent'/></b-col>
    </b-row>
    </b-container>
</div>
</template>

<script>
import * as data from '@/components/manuals/manualsData.json'
import ManualsProgress from '@/components/manuals/manualsProgress.vue'
import ManualsSubtopics from '@/components/manuals/manualsSubTopics.vue'
import ManualsStudyGuide from '@/components/manuals/ManualsStudyGuide.vue'

export default {
  components: {
    ManualsProgress,
    ManualsSubtopics,
    ManualsStudyGuide
  },
  data () {
    return {
      manualData: data.topics,
      topicId: '',
      subTopics: '',
      studyGuide: '',
      subTopicId: '',
      allManuals: [],
      isNotesComponent: true
    }
  },
  created () {
    this.getAllManuals()
    this.topicId = this.manualData[0]._id
  },

  methods: {
    getAllManuals () {
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
      }
      this.$axios
        .get('/topics', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          this.allManuals = res.data.topics
          // let topics = res.data.topics
          // let manuals = topics.filter((topic) => topic.id == this.topicId)[0].subtopics.filter((subtopic) => subtopic.id == this.subTopicId)[0].manuals
          // console.log('Manuals: ', manuals)
          // this.manuals = manuals
        })
        .catch((err) => {
          console.log(err)
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
</style>
