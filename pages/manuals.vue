<template>
<b-container class="mt-5">
  <b-row class="text-center mt-5" v-if="manuals_not_found">
    <b-col class="mt-5">
      <h3>No se encontraron resultados</h3>
    </b-col>
  </b-row>
  <b-row v-else ref="mainContainer" id="mainContainer" :style="{'height': height}">
    <b-col cols="3" class="h-100 mb-4">
      <div class="containerProgress py-3 px-2" id="containerProgress" ref="containerProgress">
        <ManualsProgress />
      </div>
    </b-col>
    <b-col cols="9" class="h-100">
      <b-row>
        <b-col cols="12">
          <div class="input-group md-form form-sm form-2 pl-0" id="search-input">
            <input class="form-control my-0 py-1 lime-border" type="text">
            <div class="input-group-append">
              <span class="input-group-text lime lighten-2" id="basic-text1">
                <i class="fas fa-search text-grey" aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="mt-3" style="height: 90%">
        <b-col cols="3" class="h-100" style="border-right: solid thin #1CA4FC"><ManualsSubTopics/></b-col>
        <b-col cols="9" class="h-100"><ManualsStudyGuide/></b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import ManualsProgress from '@/components/manuals/manualsProgress.vue'
import ManualsSubTopics from '@/components/manuals/manualsSubTopics.vue'
import ManualsStudyGuide from '@/components/manuals/manualsStudyGuide.vue'

export default {
  components: {
    ManualsProgress,
    ManualsSubTopics,
    ManualsStudyGuide
  },
  data () {
    return {
      allManuals: [],
      manuals_not_found: false,
      height: 'auto'
    }
  },
  async mounted () {
    const height = this.$refs.containerProgress.clientHeight
    this.height = `${height}px!important`
    await this.getAllManuals()
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
        })
        .catch((err) => {
          console.log(err)
          this.manuals_not_found = true
        })
    }
  }
}
</script>

<style scoped>
.containerProgress{
  -webkit-box-shadow: 0 0 8px black;
  box-shadow: 0 0 8px black;
  border-radius: 20px;
}
@media (min-width: 1200px) {
  .container {
    max-width: 97vw !important;
  }
}
#search-input{
  border-radius: 12px;
}
#search-input input{
  background-color: #F1F1F1
}
#search-input span{
  background: #5E5E5E;
}
#search-input i{
  color: white;
}
</style>
