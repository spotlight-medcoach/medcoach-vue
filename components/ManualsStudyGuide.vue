<template>
    <b-container>
        <!-- <div>{{topicId}}</div>
        <div>{{subTopicId}}</div> -->
        <div v-if="isNotesComponent === true">
            <div v-for="manual in manuals" :key="manual._id" >
                <div v-if="manual.finished === false">
                        <router-link target="_blank" :to="`/student_manual?manual_id=${manual.id}`">{{manual.name}}</router-link>
                </div>
                <div v-else>
                    <div style="color:red">{{manual.name}}</div>
                </div>
                <div>

                </div>
            </div>
        </div>

        <div v-else>
            <div  v-for="manual in manuals" :key="manual._id" >
                <router-link target="_blank" :to="`/student_manual?manual_id=${manual.id}`">{{manual.name}}</router-link>
            </div>
        </div>
    </b-container>
</template>
<script>
export default {
    props:['topicId', 'subTopicId','allManuals','isNotesComponent'],
    data(){
        return{
            manuals:[],

        }
    },
    watch:{
    subTopicId:function(){
            
            let manuals = this.allManuals.filter((topic) => topic.id == this.topicId)[0].subtopics.filter((subtopic) => subtopic.id == this.subTopicId)[0].manuals
            console.log('Manuals: ', manuals)
            this.manuals = manuals
 
        },
    allManuals:function(){
            
            let manuals = this.allManuals.filter((topic) => topic.id == this.topicId)[0].subtopics.filter((subtopic) => subtopic.id == this.subTopicId)[0].manuals
            console.log('Manuals: ', manuals)
            this.manuals = manuals
 
        }

    },
    created(){

    },
    methods:{

    }
}
</script>
<style scoped>

</style>