<template>
<div>
  <CaseIndex v-if="caseId"/>
  <QuestionsIndex :custom_test="custom_test" v-else/>
</div>
</template>
<script>
import { mapState } from 'vuex'
import QuestionsIndex from '@/components/custom_test/QuestionsIndex.vue'
import CaseIndex from '@/components/custom_test/case/CaseIndex.vue'

export default {
  name: 'custom-test',
  components: {
    QuestionsIndex,
    CaseIndex
  },
  data () {
    return {
      custom_test_id: null
    }
  },
  async created () {
    this.$store.commit('custom_test/initCustomTest')
    this.custom_test_id = this.$route.query.custom_test_id
    const customTest = JSON.parse(localStorage.getItem(`test_${this.custom_test_id}`))
    if (customTest) {
      await this.$store.dispatch('custom_test/loadCustomTest', customTest)
    } else {
      await this.$store.dispatch('custom_test/fetchCustomTest', this.custom_test_id)
    }
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
