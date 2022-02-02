<template>
  <section id="custom-test-subtopics"  class="custom-card">
    <div>
      <ul class="p-0 listado">
        <li v-for="(subtopic, index) in subtopics" :key="`subcategory-${index}`">
          <orange-checkbox
            :value="subtopic.check"
            :label="subtopic.name"
            :number="getCountSubtopic(subtopic)"
            :show_number="showNumber"
            :disabled="subtopic.disabled"
            @input="updateSubtopic(subtopic.topic_id, subtopic._id, $event)"
          />
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
import OrangeCheckbox from '@/components/OrangeCheckbox'

export default {
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  components: {
    OrangeCheckbox
  },
  computed: {
    ...mapGetters({
      subtopics: 'custom_test/subtopics'
    }),
    showNumber () {
      return this.settings.mode !== ''
    }
  },
  methods: {
    getCountSubtopic (subtopic) {
      if (this.settings.mode === 'all') {
        return subtopic.questions
      } else if (this.settings.mode === 'not_answered') {
        return subtopic.questions_not_answered
      } else if (this.settings.mode === 'answered') {
        return subtopic.questions_correct
      } else if (this.settings.mode === 'wrong') {
        return subtopic.questions_incorrect
      } else {
        return 0
      }
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
  #custom-test-subtopics {
    .listado {
      columns: 3;
      -webkit-columns: 3;
      -moz-columns: 3;
    }
    li {
      list-style: none;
    }
  }
</style>
