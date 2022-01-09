<template>
  <div>
    <img :src="profile_img" alt="perfil">
  </div>
</template>
<script>
export default {
  data () {
    return {
      profile_img: require('@/assets/images/profile.png')
    }
  }
}
</script>
