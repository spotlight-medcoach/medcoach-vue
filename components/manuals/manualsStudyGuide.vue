<template>
  <div id="manuals-study-guide" class="d-flex flex-column justify-content-between">
    <template v-if="isNotes === true">
      <div
        v-if="subtopic.manuals.length"
        class="manuals-list"
        :style="{'column-count': columnCount}"
      >
        <div v-for="manual in subtopic.manuals" :key="manual._id" class="mb-3" :class="{'review': manual.finished}">
          <nuxt-link class="pointer" :to="`/review?manual_id=${manual.id}`" v-if="manual.finished">
            {{manual.name}}
          </nuxt-link>
          <div style="opacity: 0.30" v-else>
            {{manual.name}}
          </div>
        </div>
      </div>
      <div class="row" v-else-if="!fetchedManuals">
        <div class="col-sm-12 text-center d-flex justify-content-around pointer align-items-center">
          <div>
            <b class="mb-2">Cargando manuales</b>
            <div><img src="@/assets/icons/loading.svg" width="40" /></div>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-sm-12 text-center d-flex justify-content-around pointer align-items-center">
          <div>
            <b class="mb-2">No hay manuales</b>
          </div>
        </div>
      </div>
      <div class="text-center mx-auto mx-5 my-3">
        Los manuales resaltados son aquellos en los que has realizado notas y/o flashcards
      </div>
    </template>

    <template v-else>
      <h3 class="header-md text-center mb-4">Ver manual</h3>
      <div v-if="subtopic.manuals.length" class="manuals-list" :style="{'column-count': columnCount}">
        <div v-for="manual in subtopic.manuals" :key="manual._id" class="mb-3">
          <div v-if="manual.isExtra">
            <nuxt-link class="pointer" :to="`/manual?manual_id=${manual.id}&extra=true&finishManualExtra=${manual.finished}`">{{manual.name}}</nuxt-link>
          </div>
          <div v-else>
            <nuxt-link class="pointer" :to="`/manual?manual_id=${manual.id}`">{{manual.name}}</nuxt-link>
          </div>
        </div>
      </div>
      <div class="row" v-else-if="!fetchedManuals">
        <div class="col-sm-12 text-center d-flex justify-content-around pointer align-items-center">
          <div>
            <b class="mb-2">Cargando manuales</b>
            <div><img src="@/assets/icons/loading.svg" width="40" /></div>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-sm-12 text-center d-flex justify-content-around pointer align-items-center">
          <div>
            <b class="mb-2">No hay manuales</b>
          </div>
        </div>
      </div>
    </template>
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
<style lang="scss" scoped>
  @import '@/assets/css/variables/color-palette.scss';
  #manuals-study-guide {
    .manuals-list {
      max-width: 800px;
      min-width: 560px;
      margin-left: auto;
      margin-right: auto;
    }
    .review a {
      color: #{$neutral-1000};
    }
    a {
      color: #{$neutral-400};
      text-decoration: none;
    }
    a:hover {
      color: #{$neutral-1000};
    }
  }
</style>
