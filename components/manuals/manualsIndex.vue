<template>
  <div>
    <b-container :class="containerClass">
      <b-row class="text-center mt-5" v-if="manuals_not_found">
        <b-col class="mt-5">
          <h3>No se encontraron resultados</h3>
        </b-col>
      </b-row>
      <b-row
        v-else
        ref="mainContainer"
        id="mainContainer"
        :style="{ height: height }"
      >
        <b-col cols="3" class="h-100 mb-4" v-show="!isSearch">
          <div
            class="containerProgress py-3 px-2"
            id="containerProgress"
            ref="containerProgress"
          >
            <ManualsProgress :load="load" />
          </div>
        </b-col>
        <b-col :cols="subtopics_cols" class="h-100">
          <b-row class="row-search">
            <b-col cols="12">
              <div
                class="input-group md-form form-sm form-2 pl-0"
                id="search-input"
              >
                <input
                  class="form-control my-0 py-1 lime-border"
                  type="text"
                  v-model.trim="search"
                  @focus="onFocusSearch"
                  @blur="onBlurSearch"
                />
                <div class="input-group-append">
                  <span
                    class="input-group-text lime lighten-2"
                    id="basic-text1"
                  >
                    <i class="fas fa-search text-grey" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row class="mt-3" style="height: 90%" v-show="!isSearch">
            <b-col
              cols="3"
              class="h-100"
              style="border-right: solid thin #1ca4fc"
              ><ManualsSubTopics
            /></b-col>
            <b-col
              cols="9"
              class="h-100"
              :class="isNotes ? 'full reduced' : 'full'"
            >
              <ManualsStudyGuide :isNotes="isNotes" :load="load" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <b-row class="mt-3 row-results" v-show="isSearch">
      <b-col cols="12" class="h-100">
        <manuals-results :manuals="results" :isNotes="isNotes" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ManualsProgress from '@/components/manuals/manualsProgress.vue';
import ManualsSubTopics from '@/components/manuals/manualsSubTopics.vue';
import ManualsStudyGuide from '@/components/manuals/manualsStudyGuide.vue';
import ManualsResults from '@/components/manuals/manualsResults.vue';

export default {
  name: 'manuals-index',
  props: {
    isNotes: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ManualsProgress,
    ManualsSubTopics,
    ManualsStudyGuide,
    ManualsResults,
  },
  data () {
    return {
      allManuals: [],
      manuals_not_found: false,
      height: 'auto',
      load: false,
      isSearch: false,
      search: '',
      prev_height: '',
      default_container: {
        'mt-4-5': true,
      },
      result_container: {
        'pt-5': true,
        'pb-3': true,
        'sticky-top': true,
        'sticky-container': true,
      },
    };
  },
  computed: {
    subtopics_cols () {
      if (this.isSearch) {
        return 12;
      } else {
        return 9;
      }
    },
    results () {
      let search = '';
      search = this.removeAccents(this.search.toLowerCase());
      if (search.length > 2) {
        return this.filterManuals(search);
      } else {
        return this.manuals;
      }
    },
    containerClass () {
      if (!this.isSearch) {
        return this.default_container;
      } else {
        return this.result_container;
      }
    },
    ...mapState({
      manuals: (state) => state.topics.manuals,
    }),
  },
  mounted () {
    const height = this.$refs.containerProgress.clientHeight;
    this.height = `${height}px !important`;
    if (!this.$store.state.topics.fetchedManuals) {
      this.getAllManuals();
    } else {
      this.load = true;
    }
  },
  methods: {
    getAllManuals () {
      return this.$axios
        .get('/catalogues/topics', {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then((res) => {
          this.allManuals = res.data.topics;
          this.$store.commit('topics/setTopics', this.allManuals);
          this.load = true;
        })
        .catch((err) => {
          console.log(err);
          this.manuals_not_found = true;
        });
    },
    onFocusSearch () {
      this.prev_height = this.height;
      this.height = 'auto !important';
      this.isSearch = true;
    },
    onBlurSearch () {
      if (this.search.trim().length === 0) {
        this.height = this.prev_height;
        this.isSearch = false;
      }
    },
    filterManuals (search) {
      const manuals = this.manuals.filter((manual) => {
        return (
          manual.low_manual.includes(search) ||
          manual.low_subtopic.includes(search) ||
          manual.low_subtopic.includes(search)
        );
      });
      return manuals;
    },
    removeAccents (cadena) {
      const acentos = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ú: 'u',
        Á: 'A',
        É: 'E',
        Í: 'I',
        Ó: 'O',
        Ú: 'U',
      };
      return cadena
        .split('')
        .map((letra) => acentos[letra] || letra)
        .join('')
        .toString();
    },
  },
};
</script>

<style scoped>
.containerProgress {
  -webkit-box-shadow: 0 0 8px black;
  box-shadow: 0 0 8px black;
  border-radius: 20px;
}
#search-input {
  border-radius: 12px;
}
#search-input input {
  background-color: #f1f1f1;
}
#search-input span {
  background: #5e5e5e;
}
#search-input i {
  color: white;
}
.sticky-container {
  top: 5.4rem;
  background-color: white;
  max-width: 100vw !important;
}
.sticky-container .row-search {
  margin-right: 0px !important;
  margin-left: 0px !important;
}
.row-results {
  max-width: 95vw !important;
  margin-right: auto !important;
  margin-left: auto !important;
}
.mt-4-5 {
  margin-top: 2rem;
}
</style>
