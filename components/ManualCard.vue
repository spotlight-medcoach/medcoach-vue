<template>
  <div
    class="manual review"
    :class="{ 'manual-today': today, 'finished-review': manual.reviewed}"
    @click="goToReview(manual.manual_id)"
    v-if="review"
  >
    <div class="text-overflow"><b>{{manual.manual_name}}</b></div>
    <div class="text-subtopic">{{manual.manual_subtopic_name}}</div>
    <div class="finished-icon" v-if="manual.reviewed">
      <img src="@/assets/icons/blue_check.svg" width="15" height="15">
    </div>
  </div>
  <div
    class="manual normal"
    :class="{ 'manual-today': today, 'finished': manual.finished}"
    @click="goToManual(manual.manual_id)"
    v-else
  >
    <div class="text-overflow"><b>{{manual.manual_name}}</b></div>
    <div class="text-subtopic">{{manual.manual_subtopic_name}}</div>
    <div class="finished-icon" v-if="manual.finished">
      <img src="@/assets/icons/orange_check.svg" width="15" height="15">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    manual: {
      type: Object,
      required: true
    },
    today: {
      type: Boolean,
      default: false
    },
    review: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goToManual (id) {
      if (!this.manual.finished) {
        if (this.$store.state.phase.id === 2) {
          this.$router.push({ path: '/review', query: { manual_id: id, review: false } })
        } else {
          this.$router.push({ path: '/manual', query: { manual_id: id } })
        }
      }
    },
    goToReview (id) {
      if (!this.manual.reviewed) {
        this.$router.push({ path: '/review', query: { manual_id: id, review: true } })
      }
    }
  }
}
</script>
