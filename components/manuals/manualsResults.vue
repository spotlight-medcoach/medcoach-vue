<template>
<div class="h-100">
  <div v-if="manuals.length !== 0" class="result-list">
    <b-row class="mt-2" v-for="(manual, index) in manuals" :key="'manual' + index">
      <b-col cols="12">
        <nuxt-link
          class="pointer text-decoration-none"
          :to="`/manual?manual_id=${manual.manual_id}`"
          v-if="!manual.finished || !isNotes">
          <div class="manual-txt">{{ manual.manual_name }}</div>
          <div style="font-size: 0.95rem"> {{ manual.subtopic_name }}, {{ manual.topic_name }} </div>
        </nuxt-link>
        <div style="opacity: 0.30" v-else>
          <div class="manual-txt">{{ manual.manual_name }}</div>
          <div style="font-size: 0.95rem"> {{ manual.subtopic_name }}, {{ manual.topic_name }} </div>
        </div>
        <hr>
      </b-col>
    </b-row>
  </div>
  <div class="h-100" v-else>
    <b-row class="text-center mt-5">
      <b-col class="mt-5">
        <h3>No se encontraron resultados</h3>
      </b-col>
    </b-row>
  </div>
</div>
</template>

<script>
export default {
  name: 'manuals-results',
  props: {
    manuals: {
      type: Array,
      default: () => { return [] }
    },
    isNotes: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
  .result-list .manual-txt{
    font-weight: bolder;
    font-size: 1.25rem;
    text-decoration: none !important;
  }
</style>
