<template>
  <section id="case-index" class="d-flex mx-0 justify-content-center h-100">
    <div id="right-side-questions">
      <CaseTimer class="mb-16px" :retro="retro" />
      <!-- Descripción del caso clínico -->
      <section
        id="case-content"
        class="custom-card"
        :class="{ retro: retro }"
        @click="handleClick"
      >
        <div id="case-description">
          <p class="body-title-1">CASO</p>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="caseSelected.content" />
        </div>
        <CaseQuestions :retro="retro" />
        <CaseFooter />
      </section>
    </div>
    <AsideQuestionsIndex :retro="retro" />
    <ModalImage />
  </section>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import CaseTimer from '@/components/custom_test/case/CaseTimer.vue';
import CaseQuestions from '@/components/custom_test/case/CaseQuestions.vue';
import AsideQuestionsIndex from '@/components/custom_test/case/AsideQuestionsIndex.vue';
import CaseFooter from '@/components/custom_test/case/CaseFooter.vue';
import ModalImage from '@/components/ModalImage';

export default {
  components: {
    CaseTimer,
    CaseQuestions,
    AsideQuestionsIndex,
    CaseFooter,
    ModalImage,
  },
  props: {
    retro: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      customTest: (state) => state.custom_test.customTest,
    }),
    ...mapGetters({
      caseSelected: 'custom_test/caseSelected',
      questionsByCase: 'custom_test/questionsByCase',
      caseIndex: 'custom_test/caseIndex',
    }),
  },
  methods: {
    handleClick (event) {
      if (event.target.localName === 'img' && this.retro) {
        const modal = document.getElementById('myModal');
        const modalImg = document.getElementById('img01');
        const captionText = document.getElementById('caption');
        modalImg.src = event.target.src;
        captionText.innerHTML = event.target.alt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.$store.commit('setShowStudentHeader', false);
      }
    },
  },
};
</script>
<style lang="scss">
#case-index {
  padding-top: 15px;

  .retro img {
    cursor: pointer;
  }

  #case-content {
    padding: 24px 44px 12px 44px;
    display: flex;
    flex-direction: column;
    gap: 32px;

    #case-description {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  #right-side-questions {
    min-width: 880px;
    width: 880px;
    margin-right: 15px;
    height: 100%;
    overflow-y: auto;
  }

  .report-question {
    font-size: 14px;
    text-decoration: underline;
    color: #db393f;
    cursor: pointer;
  }
}
</style>
