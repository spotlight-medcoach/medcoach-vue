<template>
  <section
    id="custom-test-topics"
    class="custom-card"
    :class="{'disabled': !settings.mode}"
  >
    <p class="header-md mb-20px">Materias</p>
    <div class="d-flex justify-content-between">
      <toggle-switch
        v-for="(topic, index) in topics"
        :value="topic.check"
        :label="topic.name"
        :key="`materia-${index}`"
        :disabled="!settings.mode"
        @input="updateTopic(topic._id, $event)"
      />
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  components: {
    ToggleSwitch
  },
  computed: {
    ...mapState({
      topics: state => state.custom_test.topics
    })
  },
  methods: {
    updateTopic (topicID, val) {
      const payload = {
        topicId: topicID,
        value: val
      }
      this.$store.commit('custom_test/setCheckTopic', payload)
      // Activando / desactivando a los subtemas
      const topic = this.topics.find(element => element._id === topicID)
      topic.subtopics.forEach((subtopic) => {
        this.updateSubtopic(topicID, subtopic._id, val)
      })
    },
    updateSubtopic (topicID, subtopicID, val) {
      const payload = {
        topicId: topicID,
        subtopicId: subtopicID,
        value: val
      }
      this.$store.commit('custom_test/setCheckSubtopic', payload)
    }
  }
}
</script>
<style lang="scss">
  #custom-test-topics {
      padding: 24.25px 24px;
      width: 100%;
  }
</style>
