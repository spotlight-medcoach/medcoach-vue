<template>
  <section id="custom-test-config">
    <div class="mr-16px flex-grow-1" style="min-width: 800px">
      <article id="left-article" ref="leftArticle">
        <CustomTestMode :settings="settings" class="mb-16px" />
        <CustomTestTopics
          :settings="settings"
          ref="customTestTopics"
          class="mb-16px"
        />
        <CustomTestSubtopics :settings="settings" class="mb-32px" />
      </article>
    </div>
    <CustomTestHistory />
  </section>
</template>
<script>
import { mapState } from "vuex";
import CustomTestMode from "@/components/custom_test_config/CustomTestMode";
import CustomTestTopics from "@/components/custom_test_config/CustomTestTopics";
import CustomTestSubtopics from "@/components/custom_test_config/CustomTestSubtopics";
import CustomTestHistory from "@/components/custom_test_config/CustomTestHistory";

export default {
  components: {
    CustomTestMode,
    CustomTestTopics,
    CustomTestSubtopics,
    CustomTestHistory,
  },
  data() {
    return {
      settings: {
        time: false,
        mode: "",
        questions_quantity: 1,
        minQuestions: 1,
        maxQuestions: 40,
      },
      customTestTopics: null,
      left_article_height: 86,
    };
  },
  computed: {
    ...mapState({
      topics: (state) => state.custom_test.topics,
      fetchedData: (state) => state.custom_test.fetchedData,
    }),
  },
  watch: {
    "settings.mode"(newVal) {
      if (newVal) {
        this.$store.commit("custom_test/setType", newVal);
        this.topics.forEach((topic) => {
          this.customTestTopics.updateTopic(topic._id, false);
        });
      }
    },
  },
  methods: {},
  mounted() {
    this.customTestTopics = this.$refs.customTestTopics;
    this.left_article_height = this.$refs.leftArticle.clientHeight;
  },
  async created() {
    this.$store.commit("custom_test/setHistory", null);
    this.$store.dispatch("custom_test/fetchHistory");
    if (!this.fetchedData) {
      await this.$store.dispatch("custom_test/init");
    }
  },
};
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
