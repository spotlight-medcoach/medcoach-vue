<template>
  <div id="extra-manuals">
    <div class="header">
      <div class="titulo">Datos extras ENARM</div>
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
    <div class="w-100" v-if="$fetchState.pending">
      <loading-state message="Cargando Manuales" height="60vh" />
    </div>
    <div class="content" v-else-if="filteredManuals.length">
      <div v-for="(manual, index) in filteredManuals" :key="`card-${index}`" style="margin-bottom: 30px;">
        <extra-manual-card :manual="manual" />
      </div>
    </div>
    <div v-else>
      <p class="no-manuals">No hay manuales por el momento</p>
    </div>
  </div>
</template>
<script>
import ExtraManualCard from '@/components/extra_manuals/ExtraManualCard.vue'
import LoadingState from '@/components/LoadingState.vue'

export default {
  components: {
    ExtraManualCard,
    LoadingState
  },
  data () {
    return {
      search: '',
      manuals: []
    }
  },
  computed: {
    filteredManuals () {
      let manuals = this.manuals
      const search = this.toCanonical(this.search)

      if (search !== '') {
        manuals = this.manuals.filter((manual) => {
          return manual.canonical.includes(search)
        })
      }
      // Ordenando de visto a no visto
      return manuals.sort((a, b) => {
        return (a.finished === b.finished) ? 0 : b.finished ? -1 : 1
      })
    }
  },
  async fetch () {
    try {
      const response = await this.$axios.get('/students/extra')
      this.manuals = response.data.manuals.map((manual) => {
        manual.canonical = this.toCanonical(manual.name)
        return manual
      })
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    toCanonical (value) {
      const acentos = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' }
      const cadena = value.split('').map(letra => acentos[letra] || letra).join('').toString()
      return cadena.toLowerCase()
    }
  }
}
</script>
<style lang="less">
  #extra-manuals {
    font-family: 'Avenir';
    padding: 48px 24px 0px 24px;
    .no-manuals {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
      margin-top: 150px;
    }
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
