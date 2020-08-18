<template>
  <div class="h-100">
    <div v-if="isNotes === true" class="h-100">
      <div v-if="subtopic.manuals.length" class="manuals-list" :style="{'column-count': columnCount}">
        <div v-for="manual in subtopic.manuals" :key="manual._id" class="mb-3">
          <nuxt-link class="pointer" target="_blank" :to="`/review?manual_id=${manual.id}`" v-if="manual.finished">
            {{manual.name}}
          </nuxt-link>
          <div style="opacity: 0.30" v-else>
            {{manual.name}}
          </div>
        </div>
      </div>
      <div class="row h-100" v-else-if="!fetchedManuals">
        <div class="col-sm-12 text-center h-100 d-flex justify-content-around pointer align-items-center">
          <div>
            <b class="mb-2">Cargando manuales</b>
            <div><img src="@/assets/icons/loading.svg" width="40" /></div>
          </div>
        </div>
      </div>
      <div class="row h-100" v-else>
        <div class="col-sm-12 text-center h-100 d-flex justify-content-around pointer align-items-center">
          <div>
            <b class="mb-2">No hay manuales</b>
          </div>
        </div>
      </div>
    </div>

    <div class="h-100" v-else>
      <div v-if="subtopic.manuals.length" class="manuals-list" :style="{'column-count': columnCount}">
        <div v-for="manual in subtopic.manuals" :key="manual._id" class="mb-3">
          <nuxt-link class="pointer" target="_blank" :to="`/manual?manual_id=${manual.id}`">{{manual.name}}</nuxt-link>
        </div>
      </div>
      <div class="row h-100" v-else-if="!fetchedManuals">
        <div class="col-sm-12 text-center h-100 d-flex justify-content-around pointer align-items-center">
          <div>
            <b class="mb-2">Cargando manuales</b>
            <div><img src="@/assets/icons/loading.svg" width="40" /></div>
          </div>
        </div>
      </div>
      <div class="row h-100" v-else>
        <div class="col-sm-12 text-center h-100 d-flex justify-content-around pointer align-items-center">
          <div>
            <b class="mb-2">No hay manuales</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: ['topicId', 'subTopicId', 'allManuals', 'isNotes'],
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
  computed: {
    columnCount () {
      let count = 1
      if (this.subtopic.manuals.length >= 12) {
        count = 2
      } else if (this.subtopic.manuals.length >= 24) {
        count = 3
      }
      return count
    },
    ...mapState({
      subtopic: state => state.topics.subtopic,
      fetchedManuals: state => state.topics.fetchedManuals
    })
  },
  methods: {

  }
}
</script>
<style>
.manuals-list{
  height: 100%;
  overflow-y:hidden;
  width: auto;
  overflow-x: auto;
}
.manuals-list::-webkit-scrollbar{
  height: 10px;
}
a{
  color: black;
}
</style>
