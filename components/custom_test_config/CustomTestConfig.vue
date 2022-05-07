<template>
  <section id="custom-test-config">
    <div
      class="mr-16px flex-grow-1"
      style="min-width: 800px;"
    >
      <article id="left-article" ref="leftArticle">
        <CustomTestMode
          :settings="settings"
          class="mb-16px"
        />
        <CustomTestTopics
          :settings="settings"
          ref="customTestTopics"
          class="mb-16px"
        />
        <CustomTestSubtopics
          :settings="settings"
          class="mb-32px"
        />
        <div class="text-right">
          <b-overlay
            :show="custom_test_loading"
            spinner-small
            class="d-inline-block"
          >
            <b-button
              variant="primary"
              @click="generateCustomTest"
            >
              Generar examen
            </b-button>
          </b-overlay>
        </div>
      </article>
    </div>
    <CustomTestHistory
      :style="{
        'height': `${left_article_height}px`
      }"
    />
  </section>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import CustomTestMode from '@/components/custom_test_config/CustomTestMode'
import CustomTestTopics from '@/components/custom_test_config/CustomTestTopics'
import CustomTestSubtopics from '@/components/custom_test_config/CustomTestSubtopics'
import CustomTestHistory from '@/components/custom_test_config/CustomTestHistory'

export default {
  components: {
    CustomTestMode,
    CustomTestTopics,
    CustomTestSubtopics,
    CustomTestHistory
  },
  data () {
    return {
      settings: {
        time: false,
        mode: '',
        questions_quantity: 1,
        minQuestions: 1,
        maxQuestions: 40
      },
      customTestTopics: null,
      custom_test_loading: false,
      left_article_height: 900
    }
  },
  computed: {
    ...mapState({
      topics: state => state.custom_test.topics,
      fetchedData: state => state.custom_test.fetchedData
    }),
    ...mapGetters({
      selectSubtopics: 'custom_test/selectSubtopics'
    })
  },
  watch: {
    'settings.mode' (newVal) {
      if (newVal) {
        this.$store.commit('custom_test/setType', newVal)
        this.topics.forEach((topic) => {
          this.customTestTopics.updateTopic(topic._id, false)
        })
      }
    }
  },
  methods: {
    async generateCustomTest () {
      if (this.settings.questions_quantity > this.settings.maxQuestions) {
        this.$toastr.error(`Debe introducir máximo ${this.settings.maxQuestions} preguntas`, 'Error')
        return false
      } else if (this.settings.questions_quantity < this.settings.minQuestions) {
        this.$toastr.error(`Debe introducir más de ${this.settings.minQuestions} pregunta(s)`, 'Error')
        return false
      } else if (!this.settings.mode) {
        this.$toastr.error('Debe seleccionar un Modo de preguntas', 'Error')
        return false
      } else {
        const params = {
          questions_count: this.settings.questions_quantity,
          by_time: this.settings.time,
          type: this.settings.mode
        }
        if (this.selectSubtopics.length > 0) {
          params.subtopics = this.selectSubtopics
        } else {
          params.subtopics = []
        }
        this.custom_test_loading = true
        try {
          const { data } = await this.$axios.post('/student/customtest', params)
          this.$router.push({ path: '/custom_test', query: { custom_test_id: data.id } })
        } catch (error) {
          const response = error.response
          this.$toastr.error(response.data.message, 'Error')
        }
        this.custom_test_loading = false
      }
    }
  },
  mounted () {
    this.customTestTopics = this.$refs.customTestTopics
    this.left_article_height = this.$refs.leftArticle.clientHeight
  },
  async created () {
    this.$store.commit('custom_test/setHistory', null)
    this.$store.dispatch('custom_test/fetchHistory')
    if (!this.fetchedData) {
      await this.$store.dispatch('custom_test/init')
    }
  }
}
</script>
<style lang="scss">
  #custom-test-config {
    padding: 20px 16px;
    display: flex;

    & > div {
      height: 86vh;
      overflow-y: scroll;
    }
  }
</style>
