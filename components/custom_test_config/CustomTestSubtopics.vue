<template>
  <section id="custom-test-subtopics" class="custom-card">
    <div>
      <ul class="listado">
        <li
          v-for="(subtopic, index) in subtopics"
          :key="`subcategory-${index}`"
        >
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
      <b-row>
        <b-col
          cols="4"
          sm="4"
          md="4"
          lg="4"
          xl="4"
        ><p class="body-title-2 float-left">Número de preguntas</p></b-col>
        <b-col sm="2" md="2" lg="2" xl="2">
          <b-form-input
            id="questions-quantity"
            :value="settings.questions_quantity"
            class="float-right mt-n1"
            type="number"
            :min="settings.minQuestions"
            :max="settings.maxQuestions"
            step="1"
            :disabled="!fetchedData"
            @input="$emit('update:questions-quantity', Number($event))"
          /></b-col>
        <b-col
          cols="3"
          sm="3"
          md="3"
          lg="3"
          xl="3"
        ><p class="ml-n2">
          Máximo {{ settings.maxQuestions }} por bloque
        </p></b-col>
        <b-col
          cols="3"
          sm="3"
          md="3"
          lg="3"
          xl="3"
        ><b-overlay
          :show="custom_test_loading"
          spinner-small
          class="mt-n1 float-right"
        >
          <b-button variant="primary" @click="generateCustomTest">
            Generar examen
          </b-button>
        </b-overlay></b-col>
      </b-row>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import OrangeCheckbox from '@/components/OrangeCheckbox';

export default {
  components: {
    OrangeCheckbox,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      custom_test_loading: false,
    };
  },
  computed: {
    ...mapGetters({
      subtopics: 'custom_test/subtopics',
      selectSubtopics: 'custom_test/selectSubtopics',
    }),
    ...mapState({
      fetchedData: (state) => state.custom_test.fetchedData,
    }),
    showNumber () {
      return this.settings.mode !== '';
    },
  },
  methods: {
    async generateCustomTest () {
      if (this.settings.questions_quantity > this.settings.maxQuestions) {
        this.$toastr.error(
          `Debe introducir máximo ${this.settings.maxQuestions} preguntas`,
          'Error',
        );
        return false;
      } else if (
        this.settings.questions_quantity < this.settings.minQuestions
      ) {
        this.$toastr.error(
          `Debe introducir más de ${this.settings.minQuestions} pregunta(s)`,
          'Error',
        );
        return false;
      } else if (!this.settings.mode) {
        this.$toastr.error('Debe seleccionar un Modo de preguntas', 'Error');
        return false;
      } else {
        const params = {
          questions_count: this.settings.questions_quantity,
          by_time: this.settings.time,
          type: this.settings.mode,
        };
        if (this.selectSubtopics.length > 0) {
          params.subtopics = this.selectSubtopics;
        } else {
          params.subtopics = [];
        }
        this.custom_test_loading = true;
        try {
          const { data } = await this.$axios.post(
            '/student/custom-tests',
            params,
          );
          this.$router.push({
            path: '/custom_test',
            query: { custom_test_id: data.data.id },
          });
        } catch (error) {
          const response = error.response;
          this.$toastr.error(response.data.message, 'Error');
        }
        this.custom_test_loading = false;
      }
    },
    getCountSubtopic (subtopic) {
      if (this.settings.mode === 'all') {
        return subtopic.questions;
      } else if (this.settings.mode === 'not_answered') {
        return subtopic.questions_not_answered;
      } else if (this.settings.mode === 'answered') {
        return subtopic.questions_correct;
      } else if (this.settings.mode === 'wrong') {
        return subtopic.questions_incorrect;
      } else {
        return 0;
      }
    },
    updateSubtopic (topicID, subtopicID, val) {
      const payload = {
        topicId: topicID,
        subtopicId: subtopicID,
        value: val,
      };
      this.$store.commit('custom_test/setCheckSubtopic', payload);
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/css/variables/color-palette.scss';

#custom-test-subtopics {
  .listado {
    columns: 3;
    -webkit-columns: 3;
    -moz-columns: 3;
    padding: 0px 0px 24px 0px;
    border-bottom: thin solid black;
    margin-bottom: 34px;
  }
  li {
    list-style: none;
  }
  #questions-quantity {
    width: 85px;
    background-color: #{$neutral-100};
  }
}
</style>
