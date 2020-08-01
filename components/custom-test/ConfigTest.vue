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
        <toggle-switch v-model="no_answered" label="Sin contestar"/>
        <toggle-switch v-model="answered" label="Contestados"/>
        <toggle-switch v-model="failed" label="Equivocados"/>
        <toggle-switch v-model="all" label="Todos"/>
      </div>
    </div>
  </div>
  <div id="row-topics" class="mt-3">
    <div class="title">Materias</div>
    <div class="d-flex justify-content-between">
      <toggle-switch v-model="topic.check" :label="topic.name" v-for="(topic, index) in topics" :key="`materia-${index}`"/>
    </div>
  </div>
  <div class="mt-3 d-flex">
    <div id="row-subtopics">
      <div class="title">Subcategoría</div>
      <div>
        <ul class="p-0 listado">
          <li v-for="(subtopic, index) in subtopics" :key="`subcategory-${index}`">
            <orange-checkbox v-model="subtopic.check" :label="subtopic.name + ` (${subtopic.questions || '...'})`" />
          </li>
        </ul>
      </div>
    </div>
    <div id="col-number" class="d-flex align-items-center justify-content-center">
      <div>
        <div class="title-bigger">No. de Preguntas</div>
        <div class="d-flex justify-content-center">
          <div>
            <input type="text"> <span style="font-size: 1.2rem"> / 2074</span>
            <div class="ml-2" style="font-size: 0.85rem"> Max. 50</div>
          </div>
        </div>
        <div class="mt-5 d-flex justify-content-center"><button>Generar Examen</button></div>
      </div>
    </div>
  </div>
  <test-history class="mt-3" />
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TestHistory from '@/components/custom-test/TestHistory.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import OrangeCheckbox from '@/components/OrangeCheckbox'

export default {
  name: 'config-test',
  components: {
    TestHistory,
    ToggleSwitch,
    OrangeCheckbox
  },
  data () {
    return {
      time: false,
      no_answered: false,
      answered: false,
      failed: false,
      all: false
    }
  },
  computed: {
    ...mapState({
      fetchedData: state => state.custom_test.fetchedData,
      topics: state => state.custom_test.topics
    }),
    ...mapGetters({
      subtopics: 'custom_test/subtopics'
    })
  },
  async created () {
    if (!this.fetchedData) {
      await this.$store.dispatch('custom_test/init')
    }
  }
}
</script>

<style lang="scss">
  #config_custom_test {
    #main {
      width: 80%;
      margin: 1rem auto;
      .title {
        font-weight: 800;
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
        width: 70%;
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
        width: 29%;
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
