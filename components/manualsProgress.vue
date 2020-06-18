<template>
    <b-container>
        <div @click="onClickButton(manual.name,manual._id, $event)" v-for="manual in data" :key="manual._id" >{{manual.name}}</div>
    </b-container>
</template>
<script>
export default {
    props:['data'],
    data(){
        return{
        }
    },
    methods:{
        onClickButton (name,id, event) {
         this.$emit('clicked', name,id)
     }
    }
}
</script>
<style scoped>

</style>