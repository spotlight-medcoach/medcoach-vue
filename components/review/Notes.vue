<template>
<div class="row notes pt-5">
  <!-- NOTES -->
  <div class="col-9">
    <div id="review" v-html="notes">
    </div>
  </div>
  <!-- OPTIONS -->
  <div class="col-3">
    <div id="options" class="d-flex align-items-start flex-column text-center">
      <div class="option mb-auto pointer" @click="openFlashcards">
        <img src="@/assets/icons/review/flashcards.svg" width="35">
        <p>Flashcards</p>
      </div>
      <div class="option mb-auto pointer">
        <img src="@/assets/icons/review/edit_notes.svg" width="35">
        <p>Editar Notas</p>
      </div>
      <div class="option mb-auto">
        <nuxt-link
          class="pointer text-decoration-none"
          target="_blank"
          :to="`/manual?manual_id=${manual_id}`">
          <img src="@/assets/icons/review/show_manual.svg" width="35">
          <p>Ver Manual</p>
        </nuxt-link>
      </div>
      <div class="option mb-auto pointer">
        <img src="@/assets/icons/review/print.svg" width="35">
        <p>Imprimir</p>
      </div>
    </div>
  </div>
  <!-- Modal Flashcards -->
  <b-modal id="modal-flashcards" title="BootstrapVue">
    <p class="my-4">Hello from modal!</p>
  </b-modal>
</div>
</template>

<script>
export default {
  name: 'notes-review',
  props: {
    manual_id: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    flashcards: {
      type: Array
    }
  },
  methods: {
    openFlashcards () {
      this.$bvModal.show('modal-flashcards')
    }
  }
}
</script>

<style>
  #review #options {
    height: 500px;
    position: sticky;
    top: 122px;
  }
  #review .option {
    width: 100%;
    min-width: 100%;
  }
</style>
