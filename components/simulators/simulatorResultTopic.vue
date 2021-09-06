<template>
<div class="table-subtopic">
      <div class="bg-orange">
        <p><b>{{this.topic.topic_name}}</b></p>
      </div>
      <div class="">
        <div class="d-flex"  v-for="(item,index) in subtopics" :key="item.subtopic">
            <div
            :class=" ['subtopic_content',
  index % 2 === 0 ? 'par' : 'impar'
 ]">
                <p>{{item.subtopic_name}}</p>
            </div>
        <div
        :class=" ['subtopic_content',
  index % 2 === 0 ? 'par' : 'impar'
 ]">
            <p>{{item.percentage.toFixed(2)}}</p>
        </div>
      </div>
    </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      subtopics: []
    }
  },
  props: {
    topic: {
      type: Object,
      required: true
    }
  },
  created () {
    this.subtopics = this.topic.subtopics
    // console.log(this.subtopics)
  }
}
</script>
<style>
.table-subtopic{
    border-style:solid;
    text-align:center;
    width:100%;
    margin: 20px;
    border-width: thin;
}
.bg-orange{
    background-color:#FE9400;
    border-bottom-style:solid;
}
.subtopic_content{
    width:50%;
    border-style:solid;
    border-width: thin;
    height:30px;
}
.par{
    background-color:#F7CEA8;
}
</style>
