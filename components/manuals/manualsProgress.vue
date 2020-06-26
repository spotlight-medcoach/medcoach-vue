<template>
  <b-container id="manuals-progress">
    <div
      @click="onClickButton(manual.name,manual._id, $event)"
      v-for="manual in data"
      :key="manual._id"
      :class="{'orange': manual.orange}"
      class="pointer">
      <div class="mb-2">{{manual.name}}</div>
      <b-progress :value="200" :max="264" class="mb-1 ml-1"></b-progress>
      <div class="mb-3">
        101 / 264
      </div>
    </div>
    <hr>
    <div class="text-center mt-5 mb-5">
      <h3 class="font-weight-bolder">260 / 675</h3>
      <h5 class="font-weight-bolder">Manuales</h5>
    </div>
  </b-container>
</template>
<script>
export default {
  props: ['data', 'manuals'],
  data () {
    return {
    }
  },
  methods: {
    onClickButton (name, id, event) {
      this.$emit('clicked', name, id)
    }
  }
}
</script>
<style>
  .orange{
    color: #FD9326;
    font-weight: bold;
  }
  #manuals-progress .progress {
    border-radius: 0.5rem !important;
    height: 0.6rem !important;
    background-color: #C4C4C4 !important;
  }
  #manuals-progress .progress .progress-bar {
    background-color: #1CA4FC !important;
    border-radius: 0.5rem !important;
  }
  #manuals-progress hr{
    border-color: #1CA4FC;
  }
</style>
