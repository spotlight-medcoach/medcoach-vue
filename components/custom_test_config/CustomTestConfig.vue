<template>
  <section id="custom-test-config">
    <CustomTestMode
      :settings="settings"
      class="mb-16px"
    />
    <CustomTestTopics
      :settings="settings"
      ref="customTestTopics"
    />
    <CustomTestSubtopics
      :settings="settings"
    />
  </section>
</template>
<script>
import { mapState } from 'vuex'
import CustomTestMode from '@/components/custom_test_config/CustomTestMode'
import CustomTestTopics from '@/components/custom_test_config/CustomTestTopics'
import CustomTestSubtopics from '@/components/custom_test_config/CustomTestSubtopics'

export default {
  components: {
    CustomTestMode,
    CustomTestTopics,
    CustomTestSubtopics
  },
  data () {
    return {
      settings: {
        time: false,
        mode: ''
      },
      customTestTopics: null
    }
  },
  computed: {
    ...mapState({
      topics: state => state.custom_test.topics
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
  mounted () {
    this.customTestTopics = this.$refs.customTestTopics
  }
}
</script>
<style lang="scss">
  #custom-test-config {
    padding: 20px 16px;
  }
</style>
