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
      <div class="d-flex align-items-center">
        <p class="subheader-xl mr-27px">Número de preguntas</p>
        <b-form-input
          id="questions-quantity"
          class="mr-27px"
          type="number"
          :min="settings.minQuestions"
          :max="settings.maxQuestions"
          step="1"
          v-model="settings.questions_quantity"
          :disabled="!fetchedData"
        />
        <p>Máximo {{settings.maxQuestions}} por bloque</p>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
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
    ...mapState({
      fetchedData: state => state.custom_test.fetchedData
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
    #questions-quantity {
      width: 85px;
    }
  }
</style>
