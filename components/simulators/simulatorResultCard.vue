<template>
<div class="table-card">
      <div class="bg-orange">
        <p><b>{{this.topic.topic_name}}</b></p>
      </div>
      <div>
        <p>{{percentage}}</p>
      </div>
</div>
</template>
<script>
export default {
  props: {
    topic: {
      type: Object,
      required: true
    }
  },
  computed: {
    percentage () {
      if (this.topic.percentage !== null) {
        return this.topic.percentage.toFixed(2)
      } else {
        return 0
      }
    }
  }
}
</script>
<style>
.table-card{
    border-style:solid;
    text-align:center;
    width:200px;
    margin-bottom: 20px;
    margin-top: 20px;
    border-width: thin;
}
.bg-orange{
    background-color:#FE9400;
    border-bottom-style:solid;
}
</style>
