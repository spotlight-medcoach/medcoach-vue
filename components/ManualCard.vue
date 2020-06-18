<template>
  <div
    :class="[
        'manual',
        manual.finished ? 'finished' : 'not-finished'
    ]"
    @click="goToManual(manual.manual_id)"
  >
    <p><b>{{manual.manual_name}}</b></p>
    <p>{{manual.manual_subtopic_name}}</p>
    <div class="finished-icon" v-if="manual.finished">
      <img src="@/assets/check.svg" width="25" height="25">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    manual: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToManual (id) {
      if (!this.manual.finished) {
        this.$router.push({ path: '/manual', query: { manual_id: id } })
      }
    }
  }
}
</script>
<style>
    .manual {
        padding: 10px 20px 1px 20px;
        margin: 10px 5px 10px 5px;
        border-radius: 10px;
        text-align: initial;
        position: relative;
    }

    .finished {
        background-color: #FD9326;
    }

    .finished > p {
        color: white;
    }

    .not-finished {
        cursor: pointer;
        background-color: #DDDDDD;
    }

    .not-finished > p {
        color: black;
    }

    .finished-icon {
        position: absolute;
        top: 10px;
        right: 10px;
    }
</style>
