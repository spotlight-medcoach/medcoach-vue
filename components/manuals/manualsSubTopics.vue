<template>
  <div id="manuals-subtopics">
    <h3 class="header-md text-center mb-4">Materia</h3>
    <div class="subtopics-container">
      <div
        v-for="(subtopic, index) in topic.subtopics"
        @click="selectSubtopic(index)"
        :key="subtopic._id"
        class="my-3 pointer subtopic-item"
        :class="{'font-weight-utra-bolder': index === subtopic_index }">
        {{subtopic.name}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      topic: state => state.topics.topic,
      subtopic_index: state => state.topics.subtopic_index
    })
  },
  methods: {
    selectSubtopic (index) {
      this.$store.dispatch('topics/changeSubtopic', index)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/css/variables/color-palette.scss';
  #manuals-subtopics {
    .subtopics-container {
      color: #{$accent_b-500} !important;
    }
    .subtopic-item:hover {
      font-weight: 900;
    }
  }
</style>
