<template>
<div class="table-card">
      <div class="bg-orange">
        <p><b>{{this.topic.type_name}}</b></p>
      </div>
      <div>
        <p>{{this.topic.percentage.toFixed(2)}}</p>
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
  created () {
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
