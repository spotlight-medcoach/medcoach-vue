<template>
  <div id="extra-manuals">
    <div class="header">
      <div class="titulo">Manuales para sacar 90</div>
      <div class="input-group md-form form-sm form-2 pl-0 search-input" style="width: auto !important;">
        <input
          style="width: 400px;"
          class="form-control my-0 py-1 lime-border"
          type="text"
          v-model.trim="search"
        >
        <div class="input-group-append">
          <span class="input-group-text lime lighten-2" id="basic-text1">
            <i class="fas fa-search text-grey" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="content">
      <div v-for="(manual, index) in manuals" :key="`card-${index}`" style="margin-bottom: 30px;">
        <extra-manual-card :manual="manual" />
      </div>
    </div>
  </div>
</template>
<script>
import ExtraManualCard from '@/components/extra_manuals/ExtraManualCard.vue'
export default {
  components: {
    ExtraManualCard
  },
  data () {
    return {
      search: '',
      manuals: [
        {
          id: '123abc',
          name: 'COVID-19',
          date: 'Martes 28 de julio, 2020',
          finished: false
        },
        {
          id: '123abc',
          name: 'COVID-19',
          date: 'Martes 28 de julio, 2020',
          finished: true,
          viewed: '15 de Noviembre 2020'
        }
      ]
    }
  }
}
</script>
<style lang="less">
  #extra-manuals {
    font-family: 'Avenir';
    padding: 48px 24px 0px 24px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .titulo {
        font-size: 32px;
        color: black;
        font-weight: 800;
      }
      .search-input {
        border-radius: 12px;
        input {
          background-color: #F1F1F1
        }
        span {
          background: #5E5E5E;
        }
        i {
          color: white;
        }
      }
    }
    .content {
      margin-top: 30px;
    }
  }
</style>
