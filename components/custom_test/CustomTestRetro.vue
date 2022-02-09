<template>
<div class="h-100">
  <CaseIndex
    v-if="caseId"
    retro
  />
  <QuestionsIndex
    v-else
    :retro="true"
    :custom_test="custom_test"
  />
</div>
</template>
<script>
import { mapState } from 'vuex'
import QuestionsIndex from '@/components/custom_test/QuestionsIndex.vue'
import CaseIndex from '@/components/custom_test/case/CaseIndex.vue'

export default {
  name: 'custom-test-retro',
  components: {
    QuestionsIndex,
    CaseIndex
  },
  data () {
    return {
      custom_test_id: null
    }
  },
  created () {
    this.$store.commit('custom_test/initCustomTest')
    this.custom_test_id = this.$route.query.custom_test_id
    this.$store.dispatch('custom_test/fetchCustomTestRetro', this.custom_test_id)
  },
  computed: {
    ...mapState({
      fetchedTest: state => state.custom_test.fetchedTest,
      caseId: state => state.custom_test.caseId,
      custom_test: state => state.custom_test.customTest
    })
  }
}
</script>
