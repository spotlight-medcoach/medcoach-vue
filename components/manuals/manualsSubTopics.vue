<template>
  <div id="manuals-subtopics">
    <h3 class="header-md text-center mb-4">Materia</h3>

    <b-skeleton-wrapper :loading="!load"> <!-- Skeleton loading -->
      <template #loading>
        <div>
          <b-skeleton class="mb-3" width="80%"></b-skeleton>
          <b-skeleton class="mb-3" width="90%"></b-skeleton>
          <b-skeleton class="mb-3" width="80%"></b-skeleton>
          <b-skeleton class="mb-3" width="90%"></b-skeleton>
          <b-skeleton class="mb-3" width="70%"></b-skeleton>
          <b-skeleton class="mb-3" width="90%"></b-skeleton>
          <b-skeleton class="mb-3" width="80%"></b-skeleton>
          <b-skeleton class="mb-3" width="80%"></b-skeleton>
          <b-skeleton class="mb-3" width="90%"></b-skeleton>
          <b-skeleton class="mb-3" width="80%"></b-skeleton>
          <b-skeleton class="mb-3" width="90%"></b-skeleton>
          <b-skeleton class="mb-3" width="70%"></b-skeleton>
          <b-skeleton class="mb-3" width="90%"></b-skeleton>
          <b-skeleton class="mb-3" width="80%"></b-skeleton>
        </div>
      </template>

      <div class="subtopics-container"> <!-- Subtopics -->
        <div
          v-for="(subtopic, index) in topic.subtopics"
          @click="selectSubtopic(index)"
          :key="subtopic._id"
          class="my-3 pointer subtopic-item"
          :class="{'font-weight-utra-bolder': index === subtopic_index }">
          {{subtopic.name}}
        </div>
      </div>

    </b-skeleton-wrapper>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
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
