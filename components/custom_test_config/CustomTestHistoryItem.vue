<template>
  <section class="custom-test-history-item">
    <div>
      <p class="font-weight-utra-bolder mb-10px">Examen {{ item.index }}</p>
      <p>{{ item.date }}</p>
    </div>
    <div class="d-flex align-items-center">
      <div class="result">
        <span v-if="item.finished">{{ parseFloat(item.score).toFixed(0) }}%</span>
        <span v-else>Pendiente</span>
      </div>
      <span class="cursor-pointer" @click="goTo()">
        <ExpandIcon
          class="icon-percent"
        />
      </span>
    </div>
  </section>
</template>
<script>
import ExpandIcon from '@/components/icons/ExpandIcon'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  components: {
    ExpandIcon
  },
  methods: {
    goTo () {
      if (this.item.finished) {
        this.$router.push({ path: '/custom_test_retro', query: { custom_test_id: this.item.id } })
      } else {
        this.$router.push({ path: '/custom_test', query: { custom_test_id: this.item.id } })
      }
    }
  }
}
</script>
<style lang="scss">
  .custom-test-history-item {
    border-bottom: 1px solid #979797;
    padding: 12px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .result {
      font-size: 17px;
      margin-right: 18px;
    }

    .icon-percent {
      height: 17px;
      transform: rotate(180deg);
    }
  }
</style>
