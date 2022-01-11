<template>
  <div id="header-searchbar">
    <SearchIcon
      style="height: 17px;"
      class="mr-2"
    />
    <input
      id="search-input"
      type="text"
    />
  </div>
</template>
<script>
import SearchIcon from '@/components/icons/SearchIcon.vue'
export default {
  components: {
    SearchIcon
  }
}
</script>
<style lang="scss">
  #header-searchbar {
    background: #F3F3F3;
    border: 1px solid #979797;
    box-sizing: border-box;
    border-radius: 5px;
    width: 867px;
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0px 10px;

    #search-input {
      height: 100%;
      flex-grow: 1;
      background: inherit;
      border: none;

      &:focus {
        outline: none;
      }
    }

    &:hover {
      border: thin solid black;
    }
  }
</style>
