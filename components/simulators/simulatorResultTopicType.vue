<template>
    <div class="table-subtopic">
        <div class="flex flex-row table-title">
        <div class="bg-orange col">
            <p><b>{{ this.topic.topic_name.toUpperCase() }}</b></p>
        </div>
        <div class="bg-orange  col">
            <p><b>Aciertos</b></p>
        </div>
        </div>
        <div class="">
            <div class="d-flex row-type"  v-for="(item, index) in types" :key="item.name">
                <div
                :class=" ['subtopic_content',
    index % 2 === 0 ? 'par' : 'impar',
    index === types.length - 1 ? 'last-row' : ''
    ]">
                    <p style="margin-top: 5px;">{{item.name}}</p>
                </div>
            <div
            :class=" ['subtopic_content',
    index % 2 === 0 ? 'par' : 'impar',
    index === types.length - 1 ? 'last-row' : ''
    ]">
                <p style="margin-top: 5px;">{{ `${item.total_correct} de ${item.total}` }}</p>
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
    this.types = this.topic.types
    // console.log(this.subtopics)
  }
}
</script>
<style>
b {
    font-weight: 900;
}
.table-subtopic{
    border-style: solid;
    text-align:center;
    width: 100%;
    border-width: thin;
}
.bg-orange{
    background-color:#FE9400;
    border-bottom-style:solid;
}
.subtopic_content{
    width:50%;
    border-bottom: solid;
    border-width: thin;
    height:30px;
}
.row-type .subtopic_content:first-child {
    border-right: solid;
    border-width: thin;
}
.last-row {
    border-bottom: none;
}
.par{
    background-color:#F7CEA8;
}
.flex {
    display: flex;
    flex-wrap: wrap;
}
.col {
    flex: 1 0 21%;
    border-right: 1px solid black;
}
.table-title .bg-orange:last-child {
    border-right: none;
}
</style>
