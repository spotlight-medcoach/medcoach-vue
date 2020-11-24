<template>
<div class="extra-manual-card" :class="[manual.viewed ? 'viewed' : 'no-viewed']">
  <div class="main d-flex justify-content-between align-items-center">
    <div>
      <div class="d-flex align-items-end">
        <span class="name mr-4">{{ manual.name }}</span>
        <span class="date">{{ manual.date }}</span>
      </div>
      <div class="viewed mt-2" v-if="manual.finished">
        <span>Visto el {{ manual.viewed }}</span>
      </div>
    </div>
    <div class="d-flex">
      <button class="button mr-3">Ver Notas</button>
      <button class="button">
        <span v-if="manual.finished">
          Volver a ver
        </span>
        <span v-else>
          Ver Manual
        </span>
      </button>
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
    padding: 28px;
    border-radius: 8px;
    box-shadow: 0px 4px 21px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    .name {
      font-weight: 800;
      font-size: 24px;
    }
    .date {
      font-size: 20px;
    }
    .button {
      background: #FE9501;
      border-radius: 12px;
      padding: 10px 14px;
      color: white;
      font-weight: 400;
      border: none;
    }
    .viewed {
      font-size: 12px;
      font-style: italic;
    }
  }
</style>
