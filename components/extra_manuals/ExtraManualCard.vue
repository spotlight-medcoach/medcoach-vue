<template>
<div class="extra-manual-card" :class="[manual.finished ? 'viewed' : 'no-viewed']">
  <div class="main d-flex justify-content-between align-items-center">
    <div>
      <div class="d-flex align-items-end">
        <span class="name">{{ manual.name }}</span>
      </div>
      <div class="viewed mt-2" v-if="manual.finished">
        <span>Visto el {{ manual.date }}</span>
      </div>
    </div>
    <div class="d-flex">
      <nuxt-link
        class="button mr-3"
        :to="`/review?manual_id=${manual.id}&extra=true`"
      >Ver Notas</nuxt-link>
      <nuxt-link :to="`/manual?manual_id=${manual.id}&extra=true&finishManualExtra=${manual.finished}`" class="button">
        <span v-if="manual.finished">
          Volver a ver
        </span>
        <span v-else>
          Ver Manual
        </span>
      </nuxt-link>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    manual: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="less">
  .viewed {
    background-color: black;
    color: white;
  }
  .extra-manual-card {
    padding: 20px 28px;
    border-radius: 8px;
    box-shadow: 0px 4px 21px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    .name {
      font-weight: 800;
      font-size: 26px;
    }
    .date {
      font-size: 20px;
    }
    .button {
      background: #FE9501;
      border-radius: 12px;
      border: none;
      color: white;
      font-size: 18px;
      font-weight: 600;
      outline: none;
      padding: 10px 14px;
    }
    .viewed {
      font-size: 12px;
      font-style: italic;
    }
  }
</style>
