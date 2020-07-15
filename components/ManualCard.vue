<template>
  <div
    class="manual review"
    :class="{ 'manual-today': today, 'finished-review': manual.reviewed}"
    @click="goToReview(manual.manual_id)"
    v-if="review"
  >
    <div class="text-overflow"><b>{{manual.manual_name}}</b></div>
    <div>{{manual.manual_subtopic_name}}</div>
    <div class="finished-icon" v-if="manual.reviewed">
      <img src="@/assets/icons/blue_check.svg" width="25" height="25">
    </div>
  </div>
  <div
    class="manual normal"
    :class="{ 'manual-today': today, 'finished': manual.finished}"
    @click="goToManual(manual.manual_id)"
    v-else
  >
    <div class="text-overflow"><b>{{manual.manual_name}}</b></div>
    <div>{{manual.manual_subtopic_name}}</div>
    <div class="finished-icon" v-if="manual.finished">
      <img src="@/assets/orange_check.svg" width="25" height="25">
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
        this.$router.push({ path: '/manual', query: { manual_id: id } })
      }
    },
    goToReview (id) {
      if (!this.manual.reviewed) {
        this.$router.push({ path: '/review', query: { manual_id: id } })
      }
    }
  }
}
</script>
<style>
  .manual {
    padding: 10px 20px;
    margin: 20px 12px;
    border-radius: 10px;
    text-align: initial;
    position: relative;
    opacity: 0.45;
  }
  .manual-today {
    opacity: 1;
  }
  .normal {
    cursor: pointer;
    background-color: #C4C4C4;
    color: black;
  }
  .finished {
    background-color: #FD9326;
    color: white;
    cursor: default;
  }
  .review {
    cursor: pointer;
    background-color: #C5F5FF;
    color: black;
  }
  .finished-review {
    cursor: default;
    background-color: #1CA4FC;
    color: white;
  }
  .finished-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  .text-overflow {
    text-overflow: clip;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    margin-bottom: 10px;
  }
</style>
