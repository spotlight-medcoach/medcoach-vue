<template>
    <b-container>
        <div v-if="subTopics == ''">
             <div @click="onPassSubtopicId(subtopic._id, $event)" v-for="subtopic in data[0].subtopics" :key="subtopic._id">{{subtopic.name}}</div>
        </div>
        <div v-else @click="onPassSubtopicId(subTopic._id, $event)" v-for="subTopic in subTopics[0].subtopics" :key="subTopic" >
            {{subTopic.name}}
        </div>
    </b-container>
</template>

<script>
export default {
    props:['subTopics','data'],
    data(){
        return{
            
        }
    },
    methods:{
        onPassSubtopicId (id, event) {
        this.$emit('clicked', id)
     }
    }
}
</script>

<style scoped>

</style>