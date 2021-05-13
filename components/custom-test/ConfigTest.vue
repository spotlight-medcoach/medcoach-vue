<template>
<div id="main">
  <div id="row-mode" class="d-flex">
    <div id="exam-mode">
      <div class="title">Modo de examen</div>
      <toggle-switch v-model="time" label="Tiempo"/>
    </div>
    <div id="question-mode">
      <div class="title">Modo de preguntas</div>
      <div class="d-flex justify-content-between">
        <toggle-switch-radio v-model="type" label="Sin contestar" name="type" valor="not_answered"/>
        <toggle-switch-radio v-model="type" label="Contestados" name="type" valor="answered"/>
        <toggle-switch-radio v-model="type" label="Equivocados" name="type" valor="wrong"/>
        <toggle-switch-radio v-model="type" label="Todos" name="type" valor="all"/>
      </div>
    </div>
  </div>
  <div id="row-topics" class="mt-3" :class="{'disabled': !type}">
    <div class="title d-flex aling-items-end">
      Materias
      <toggle-switch v-model="allTopics" label="" :disabled="!type"/>
    </div>
    <div class="d-flex justify-content-between">
      <toggle-switch
        :value="topic.check"
        @input="updateTopic(topic._id, $event)"
        :label="topic.name"
        v-for="(topic, index) in topics"
        :key="`materia-${index}`"
        :disabled="!type"/>
    </div>
  </div>
  <div class="mt-3 d-flex">
    <div id="row-subtopics">
      <div class="title">Subcategoría</div>
      <div>
        <ul class="p-0 listado">
          <li v-for="(subtopic, index) in subtopics" :key="`subcategory-${index}`">
            <orange-checkbox
              :value="subtopic.check"
              @input="updateSubtopic(subtopic.topic_id, subtopic._id, $event)"
              :label="subtopic.name"
              :number="getCountSubtopic(subtopic)"
              :show_number="showNumber"
              :disabled="subtopic.disabled"/>
          </li>
        </ul>
      </div>
    </div>
    <div id="col-number" class="d-flex align-items-center justify-content-center">
      <div>
        <div class="title-bigger">No. de Preguntas</div>
        <div class="d-flex justify-content-center">
          <div>
            <input
              type="number"
              :min="minQuestions"
              :max="maxQuestions"
              step="1"
              class="text-center"
              :disabled="!this.fetchedData"
              v-model.number="questQuantity">
              <span style="font-size: 1.2rem" v-if="type === 'all' || type === 'not_answered'"> / {{ countQuestions || 'Calculando...'}}</span>
            <div class="ml-2" style="font-size: 0.85rem"> Max. {{maxQuestions}}</div>
          </div>
        </div>
        <div class="mt-5 d-flex justify-content-center" v-if="this.fetchedData">
          <b-overlay
                  :show="busy"
                  rounded
                  opacity="0.6"
                  spinner-small
                  spinner-variant="primary"
                  class="d-inline-block"
                >
            <button @click="createCustomTest">Generar Examen</button>
          </b-overlay>
        </div>
        <div class="mt-5 text-center" v-else>
          <h4>Cargando...</h4>
        </div>
      </div>
    </div>
  </div>
  <test-history class="mt-5" />
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TestHistory from '@/components/custom-test/TestHistory.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import ToggleSwitchRadio from '@/components/ToggleSwitchRadio.vue'
import OrangeCheckbox from '@/components/OrangeCheckbox'

export default {
  name: 'config-test',
  components: {
    TestHistory,
    ToggleSwitch,
    ToggleSwitchRadio,
    OrangeCheckbox
  },
  data () {
    return {
      time: false,
      type: '',
      no_answered: true,
      answered: false,
      failed: false,
      allModes: false,
      questQuantity: 1,
      maxQuestions: 40,
      minQuestions: 1,
      busy: false
    }
  },
  computed: {
    showNumber () {
      return this.type !== ''
    },
    allTopics: {
      get () {
        return this.topics.every(topic => topic.check)
      },
      set (newVal) {
        this.topics.forEach((topic, index) => {
          this.updateTopic(topic._id, newVal)
        })
      }
    },
    ...mapState({
      fetchedData: state => state.custom_test.fetchedData,
      topics: state => state.custom_test.topics
    }),
    ...mapGetters({
      subtopics: 'custom_test/subtopics',
      countQuestions: 'custom_test/countQuestions',
      selectSubtopics: 'custom_test/selectSubtopics'
    })
  },
  async created () {
    this.$store.commit('custom_test/setHistory', null)
    this.$store.dispatch('custom_test/fetchHistory')
    if (!this.fetchedData) {
      await this.$store.dispatch('custom_test/init')
    }
  },
  watch: {
    type (newVal) {
      if (newVal) {
        if (newVal !== '') {
          this.$store.commit('custom_test/setType', newVal)
        } else {
          this.$store.commit('custom_test/setType', '')
        }
        this.topics.forEach((topic) => {
          this.updateTopic(topic._id, false)
        })
      }
    }
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
    },
    createCustomTest () {
      if (this.questQuantity > this.maxQuestions) {
        this.$toastr.error(`Debe introducir máximo ${this.maxQuestions} preguntas`, 'Error')
        return false
      } else if (this.questQuantity < this.minQuestions) {
        this.$toastr.error(`Debe introducir más de ${this.minQuestions} pregunta(s)`, 'Error')
        return false
      } else if (!this.type) {
        this.$toastr.error('Debe seleccionar un Modo de preguntas', 'Error')
        return false
      } else {
        const params = {
          questions_count: this.questQuantity,
          by_time: this.time,
          type: this.type
        }
        if (this.selectSubtopics.length > 0) {
          params.subtopics = this.selectSubtopics
        } else {
          params.subtopics = []
        }
        this.busy = true
        this.$axios.post('/student/customtest', params)
          .then((result) => {
            this.$router.push({ path: '/custom_test', query: { custom_test_id: result.data.id } })
            console.log(result)
          })
          .catch((error) => {
            const response = error.response
            this.$toastr.error(response.data.message, 'Error')
          })
          .finally(() => {
            this.busy = false
          })
      }
    },
    getCountSubtopic (subtopic) {
      if (this.type === 'all') {
        return subtopic.questions
      } else if (this.type === 'not_answered') {
        return subtopic.questions_not_answered
      } else if (this.type === 'answered') {
        return subtopic.questions_correct
      } else if (this.type === 'wrong') {
        return subtopic.questions_incorrect
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="scss">
  @media screen and (min-width: 1000px) {
    #config_custom_test {
      #main {
        width: 90%;
      }
    }
  }
  @media screen and (min-width: 1600px) {
    #config_custom_test {
      #main {
        width: 80%;
      }
    }
  }
  #config_custom_test {
    #main {
      margin: 1rem auto;
      .title {
        font-weight: 700;
        font-size: 1rem;
        padding-bottom: 1rem;
      }
      .title-bigger {
        font-weight: 700;
        font-size: 1.5rem;
        padding-bottom: 1rem;
      }
      #row-mode {
        box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        padding: 1rem;
        #exam-mode {
          border-right: thin solid;
          width: auto;
          padding-right: 2rem;
          margin-right: 2rem;
        }
        #question-mode {
          width: 75%;
        }
      }
      #row-topics {
        box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        padding: 1rem;
        width: 100%;
      }
      #row-subtopics {
        box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        padding: 1rem;
        width: 74%;
        .listado {
          columns: 3;
          -webkit-columns: 3;
          -moz-columns: 3;
        }
        li {
          list-style: none;
        }
      }
      #col-number {
        width: 25%;
        box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        margin-left: 1rem;
        button {
          background: #FE9500;
          border-radius: 5px;
          border: none;
          padding: 6px 9px;
          font-weight: 600;
          font-size: 1.2rem;
          color: white;
        }
        input {
          border: 2px solid #000000;
          width: 4rem;
        }
      }
    }
  }
</style>
