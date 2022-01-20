<template>
  <div id="manuals" class="full-height-container">
    <b-row class="text-center mt-5" v-if="manuals_not_found">
      <b-col class="mt-5">
        <h3>No se encontraron resultados</h3>
      </b-col>
    </b-row>
    <section class="page-content d-flex align-items-center pl-4" v-else>
      <article>
        <div class="shadow-sm m-2 px-3 pt-5 pb-4">
          <ManualsProgress :load="load" />
        </div>
      </article>
      <article>
        <div class="shadow-sm m-2 px-3 pt-5">
          <ManualsSubTopics />
        </div>
      </article>
      <article>
        <div class="shadow-sm m-2 px-3 pt-5">
          <ManualsStudyGuide :isNotes="isNotes"/>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ManualsProgress from '@/components/manuals/manualsProgress.vue'
import ManualsSubTopics from '@/components/manuals/manualsSubTopics.vue'
import ManualsStudyGuide from '@/components/manuals/manualsStudyGuide.vue'
// import ManualsResults from '@/components/manuals/manualsResults.vue'

export default {
  components: {
    ManualsProgress,
    ManualsSubTopics,
    ManualsStudyGuide
    // ManualsResults
  },
  layout: 'new_default',
  props: {
    isNotes: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      allManuals: [],
      manuals_not_found: false,
      load: false
    }
  },
  computed: {
    subtopics_cols () {
      if (this.isSearch) {
        return 12
      } else {
        return 9
      }
    },
    results () {
      let search = ''
      search = this.removeAccents(this.search.toLowerCase())
      if (search.length > 2) {
        return this.filterManuals(search)
      } else {
        return this.manuals
      }
    },
    containerClass () {
      if (!this.isSearch) {
        return this.default_container
      } else {
        return this.result_container
      }
    },
    ...mapState({
      manuals: state => state.topics.manuals
    })
  },
  mounted () {
    if (!this.$store.state.topics.fetchedManuals) {
      this.getAllManuals()
    } else {
      this.load = true
    }
  },
  methods: {
    getAllManuals () {
      return this.$axios
        .get('/topics', {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        })
        .then((res) => {
          this.allManuals = res.data.topics
          this.$store.commit('topics/setTopics', this.allManuals)
          this.load = true
        })
        .catch((err) => {
          console.log(err)
          this.manuals_not_found = true
        })
    },
    filterManuals (search) {
      const manuals = this.manuals.filter((manual) => {
        return manual.low_manual.includes(search) || manual.low_subtopic.includes(search) || manual.low_subtopic.includes(search)
      })
      return manuals
    },
    removeAccents (cadena) {
      const acentos = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' }
      return cadena.split('').map(letra => acentos[letra] || letra).join('').toString()
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-content {
    * {
      font-family: 'Avenir', sans-serif;
    }
    article
    {
      height: 90%;
      > .shadow-sm {
        height: 100%;
        overflow-y: auto;
        > * {
          height: 100%;
        }
      }
      &:nth-child(1) {
        flex-basis: 400px;
      }
      &:nth-child(2) {
        flex-basis: 370px;
      }
      &:nth-child(3) {
        flex-basis: 400px;
        flex-grow: 1;
      }
    }
  }
</style>
