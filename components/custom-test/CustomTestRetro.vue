<template>
<div>
  <case-index :retro="true" v-if="caseId"/>
  <questions :custom_test="custom_test" v-else/>
</div>
</template>
<script>
import { mapState } from 'vuex'
import Questions from '@/components/custom-test/Questions.vue'
import CaseIndex from '@/components/custom-test/CaseIndex.vue'

export default {
  name: 'custom-test-retro',
  components: {
    Questions,
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
