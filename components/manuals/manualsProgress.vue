<template>
  <div id="manuals-progress">
    <div class="topics-container d-flex flex-column justify-content-between">
      <div
        class="mb-3 cursor-pointer"
        @click="selectTopic(index)"
        @mouseover="handleHoverTopic(index, true)"
        @mouseleave="handleHoverTopic(index, false)"
        v-for="(manual, index) in topics"
        :key="manual._id"
        >
        <div v-if="load">
          <custom-progress-bar
            :actualValue = manual.progress
            :totalValue = manual.total
            :topHeader = manual.name
            :topHint = "manual.progress + '/' + manual.total"
            :colorVariant = "isHighlight(index) ? 'blue' : 'neutral'"
            v-if="manual"
          />
        </div>
        <div v-else>
          cargando...
        </div>
      </div>
    </div>
    <div class="text-center py-3">
      <h5 class="header-md" v-if="load">
        <h5 class="header-md">Total vistos</h5>
        {{ total_progress }} / {{ total_manuals }}
      </h5>
      <h3 class="font-weight-bolder" v-else>
        cargando...
      </h3>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CustomProgressBar from '@/components/_functional/customProgressBar.vue'
export default {
  components: {
    CustomProgressBar
  },
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      topicIdxSelected: 0,
      topicIdxOnHover: -1
    }
  },
  computed: {
    total_progress () {
      let progress = 0
      this.topics.forEach((topic) => {
        progress += topic.progress
      })
      return progress
    },
    total_manuals () {
      let total = 0
      this.topics.forEach((topic) => {
        total += topic.total
      })
      return total
    },
    ...mapState({
      topics: state => state.topics.data,
      topic: state => state.topics.topic,
      topic_index: state => state.topics.topic_index
    })
  },
  methods: {
    selectTopic (index) {
      this.$store.dispatch('topics/changeTopic', index)
      this.topicIdxSelected = index
    },
    handleHoverTopic (index, isOnHover) {
      this.topicIdxOnHover = isOnHover ? index : -1
    },
    isHighlight (index) {
      return index === this.topicIdxSelected || index === this.topicIdxOnHover
    }
  }
}
</script>
<style scoped>
  #manuals-progress {
    display: grid;
    grid-template-rows: minmax(auto, 600px) auto;
    align-content: space-between;
  }
  .topics-container {
    max-height: 600px;
  }
</style>
