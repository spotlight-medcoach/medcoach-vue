<template>
    <b-container>
        <!-- <div>{{topicId}}</div>
        <div>{{subTopicId}}</div> -->
        <div v-if="isNotesComponent === true">
            <div v-for="manual in manuals" :key="manual._id" class="mb-3">
                <div v-if="manual.finished === false">
                        <router-link target="_blank" :to="`/manual?manual_id=${manual.id}`">{{manual.name}}</router-link>
                </div>
                <div v-else>
                    <div style="color:red">{{manual.name}}</div>
                </div>
                <div>

                </div>
            </div>
        </div>

        <div v-else>
            <div  v-for="manual in manuals" :key="manual._id" class="mb-3">
                <router-link target="_blank" :to="`/student_manual?manual_id=${manual.id}`">{{manual.name}}</router-link>
            </div>
        </div>
    </b-container>
</template>
<script>
export default {
  props: ['topicId', 'subTopicId', 'allManuals', 'isNotesComponent'],
  data () {
    return {
      manuals: []
    }
  },
  watch: {
    subTopicId () {
      console.log('Topic:', this.topicId)
      console.log('Subtopic:', this.subTopicId)
      const filtered = this.allManuals.filter(topic => topic.id === this.topicId)[0].subtopics.filter(subtopic => subtopic.id === this.subTopicId)
      if (filtered.length > 0) {
        const manuals = filtered[0].manuals
        console.log('Manuals: ', manuals)
        this.manuals = manuals
      }
    },
    allManuals () {
      console.log('Topic:', this.topicId)
      console.log('Subtopic:', this.subTopicId)
      const filtered = this.allManuals.filter(topic => topic.id === this.topicId)[0].subtopics.filter(subtopic => subtopic.id === this.subTopicId)
      if (filtered.length > 0) {
        const manuals = filtered[0].manuals
        console.log('Manuals: ', manuals)
        this.manuals = manuals
      }
    }
  },
  created () {

  },
  methods: {

  }
}
</script>
<style scoped>

</style>
