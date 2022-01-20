<template>
  <article>
    <div
      v-for="(subtopic, index) in topic.subtopics"
      @click="selectSubtopic(index)"
      :key="subtopic._id"
      class="mb-3 pointer"
      :class="{'orange': index === subtopic_index }">
      {{subtopic.name}}
    </div>
  </article>
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
