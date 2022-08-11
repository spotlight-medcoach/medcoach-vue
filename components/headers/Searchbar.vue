<template>
  <div
    id="header-searchbar"
    @click="isSearchbarOpen = true"
    @focusout="closeSearchOptions()"
  >
    <div :class="[classW]">
      <SearchIcon style="height: 17px" class="mr-2" />
      <input
        id="search-input"
        v-model="search"
        autocomplete="off"
        type="text"
      />
    </div>
    <div v-if="loaded && isSearchbarOpen" class="result-list px-0 py-2">
      <div>
        <span class="body-xsm text-primary ml-4">Manuales</span>
        <hr class="mt-1 mb-0" />
        <template v-if="manualsResults.length">
          <template v-for="(manual, index) in manualsResults">
            <nuxt-link
              :key="'manual' + index"
              class="result-list-item d-flex align-items-center px-4 text-decoration-none"
              :to="`/manual?manual_id=${manual.manual_id}`"
            >
              <div class="classification-icon">
                <ManualsIcon />
              </div>
              <div class="manual-txt">{{ manual.manual_name }}</div>
              <div class="manual-ext ml-auto text-right body-xsm">
                <div>
                  <b>{{ manual.subtopic_name }}</b>
                </div>
                <div>
                  <b>{{ manual.topic_name }}</b>
                </div>
              </div>
            </nuxt-link>
          </template>
        </template>
        <div v-else class="px-4 py-2" style="opacity: 0.3">
          <p>No se encontraron resultados</p>
        </div>
      </div>
      <div v-if="!isFreeTrial">
        <span class="body-xsm text-primary ml-4">Notas</span>
        <hr class="mt-1 mb-0" />
        <template v-if="notesResults.length">
          <template v-for="(manual, index) in notesResults">
            <nuxt-link
              :key="'manual' + index"
              class="result-list-item d-flex align-items-center px-4 text-decoration-none"
              :to="`/manual?manual_id=${manual.manual_id}`"
            >
              <div class="classification-icon">
                <NotesIcon />
              </div>
              <div class="manual-txt">{{ manual.manual_name }}</div>
              <div class="manual-ext ml-auto text-right body-xsm">
                <div>
                  <b>{{ manual.subtopic_name }}</b>
                </div>
                <div>
                  <b>{{ manual.topic_name }}</b>
                </div>
              </div>
            </nuxt-link>
          </template>
        </template>
        <div v-else class="px-4 py-2" style="opacity: 0.3">
          <p>No se encontraron resultados</p>
        </div>
      </div>
      <div>
        <span class="body-xsm text-primary ml-4">Infográficos</span>
        <hr class="mt-1 mb-0" />
        <template v-if="infographicsResults.length">
          <template v-for="(infographic, index) in infographicsResults">
            <nuxt-link
              :key="'infographic' + index"
              class="result-list-item d-flex align-items-center px-4 text-decoration-none"
              :to="`/infographics?infographic_id=${infographic._id}`"
            >
              <div class="classification-icon">
                <img :src="infographic.image" :alt="infographic.name" />
              </div>
              <div class="infographic-txt">{{ infographic.name }}</div>
            </nuxt-link>
          </template>
        </template>
        <div v-else class="px-4 py-2" style="opacity: 0.3">
          <p>No se encontraron resultados</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import ManualsIcon from "@/components/icons/ManualsIcon.vue";
import NotesIcon from "@/components/icons/NotesIcon.vue";
export default {
  components: {
    SearchIcon,
    ManualsIcon,
    NotesIcon,
  },
  data() {
    return {
      classW: "searchbar-input",
      window: {
        width: 0,
        height: 0,
      },
      search: "",
      isSearchbarOpen: false,
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    manualsResults() {
      if (this.manuals) {
        if (this.search.length) {
          const search = this.removeAccents(this.search.toLowerCase());
          return this.filterManuals(search).slice(0, 3);
        }
        return this.manuals.slice(0, 3);
      }
      return [];
    },
    notesResults() {
      if (this.manuals) {
        if (this.search.length) {
          const search = this.removeAccents(this.search.toLowerCase());
          return this.filterManuals(search)
            .filter((manual) => manual.finished)
            .slice(0, 3);
        }
        return this.manuals.filter((manual) => !manual.finished).slice(0, 3);
      }
      return [];
    },
    infographicsResults() {
      if (this.infographics) {
        if (this.search.length) {
          const search = this.removeAccents(this.search.toLowerCase());
          return this.infographics
            .filter((infographic) =>
              infographic.name.toLowerCase().includes(search)
            )
            .slice(0, 3);
        }
        return this.infographics.slice(0, 3);
      }
      return [];
    },
    ...mapState({
      isFreeTrial: "isFreeTrial",
      manuals: (state) => state.topics.manuals,
      loaded: (state) => state.topics.fetchedManuals,
      infographics: (state) => state.infographics.infographics,
    }),
  },
  methods: {
    handleResize() {
      if (window.innerWidth > 1193) {
        this.classW = "searchbar-input";
      }
      if (window.innerWidth <= 1193) {
        this.classW = "searchbar-input-2";
      }

      if (window.innerWidth <= 891) {
        this.classW = "searchbar-input-3";
      }
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    filterManuals(search) {
      const manuals = this.manuals.filter((manual) => {
        return (
          manual.low_manual.includes(search) ||
          manual.low_subtopic.includes(search) ||
          manual.low_subtopic.includes(search)
        );
      });
      return manuals;
    },
    removeAccents(cadena) {
      const acentos = {
        á: "a",
        é: "e",
        í: "i",
        ó: "o",
        ú: "u",
        Á: "A",
        É: "E",
        Í: "I",
        Ó: "O",
        Ú: "U",
      };
      return cadena
        .split("")
        .map((letra) => acentos[letra] || letra)
        .join("")
        .toString();
    },
    closeSearchOptions() {
      setTimeout(() => {
        this.isSearchbarOpen = false;
      }, 200);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/variables/color-palette.scss";
#header-searchbar {
  position: relative;
  .searchbar-input {
    background: #f3f3f3;
    border: 1px solid #979797;
    border-radius: 5px;
    width: 867px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0px 10px;
    position: relative;
    z-index: 9;
    input {
      height: 100%;
      flex-grow: 1;
      background: inherit;
      border: none;
      &:focus {
        outline: none;
      }
    }
    .search-icon {
      width: 17px;
      height: 17px;
    }
    &:hover {
      border: thin solid black;
    }
  }
  .searchbar-input-2 {
    background: #f3f3f3;
    border: 1px solid #979797;
    border-radius: 5px;
    width: 567px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0px 10px;
    position: relative;
    z-index: 9;
    input {
      height: 100%;
      flex-grow: 1;
      background: inherit;
      border: none;
      &:focus {
        outline: none;
      }
    }
    .search-icon {
      width: 17px;
      height: 17px;
    }
    &:hover {
      border: thin solid black;
    }
  }
  .searchbar-input-3 {
    background: #f3f3f3;
    border: 1px solid #979797;
    border-radius: 5px;
    width: 367px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0px 10px;
    position: relative;
    z-index: 9;
    input {
      height: 100%;
      flex-grow: 1;
      background: inherit;
      border: none;
      &:focus {
        outline: none;
      }
    }
    .search-icon {
      width: 17px;
      height: 17px;
    }
    &:hover {
      border: thin solid black;
    }
  }
  .searchbar-input + * {
    position: absolute;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.25);
    .result-list-item {
      height: 45px;
      color: #{$neutral-900};
      &:hover {
        background-color: #{$neutral-100};
      }
      &:not(a) {
        cursor: default;
      }
    }
    .body-xsm {
      color: #{$neutral-400};
    }
    .classification-icon {
      width: 60px;
      text-align: center;
      > * {
        width: 32px;
        height: 32px;
      }
    }
  }
}
</style>
