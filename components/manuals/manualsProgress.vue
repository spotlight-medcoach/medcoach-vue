<template>
  <b-container id="manuals-progress">
    <div
      @click="selectTopic(index)"
      v-for="(manual, index) in topics"
      :key="manual._id"
      :class="{'orange': index === topic_index}"
      class="pointer">
      <div class="mb-2">{{manual.name}}</div>
      <b-progress :value="manual.progress" :max="manual.total" class="mb-1 ml-1"></b-progress>
      <div class="mb-3">
        {{ manual.progress }} / {{ manual.total }}
      </div>
    </div>
    <hr>
    <div class="text-center mt-5 mb-5">
      <h3 class="font-weight-bolder">{{ total_progress }} / {{ total_manuals }}</h3>
      <h5 class="font-weight-bolder">Manuales</h5>
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
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
    }
  }
}
</script>
<style>
  .orange{
    color: #FD9326;
    font-weight: bold;
  }
  #manuals-progress .progress {
    border-radius: 0.5rem !important;
    height: 0.6rem !important;
    background-color: #C4C4C4 !important;
  }
  #manuals-progress .progress .progress-bar {
    background-color: #1CA4FC !important;
    border-radius: 0.5rem !important;
  }
  #manuals-progress hr{
    border-color: #1CA4FC;
  }
</style>
