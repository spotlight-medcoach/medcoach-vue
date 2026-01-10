<template>
  <div class="background-gray">
    <div class="only-pc">
      <Login v-if="screen == 'login'" />
      <RecoveryPassword v-else-if="screen == 'recovery-password'" />
    </div>
    <div class="only-small-device">
      <p v-if="inMaintenance">
        Lo sentimos, por el momento el sitio se encuentra en mantenimiento.
      </p>
      <p v-else>Este ingreso sólo es disponible por computadora.</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Login from '@/components/landing/Login.vue';
import RecoveryPassword from '@/components/landing/RecoveryPassword';
export default {
  components: {
    Login,
    RecoveryPassword,
  },
  layout: 'index',
  data () {
    return {
      inMaintenance: false,
    };
  },
  computed: {
    ...mapGetters({
      screen: 'landing/screen',
    }),
  },
  created () {
    this.inMaintenance = process.env.IN_MAINTENANCE === 'true';
  },
};
</script>
<style>
.background-gray {
  background: rgba(238, 242, 245, 0.725005);
}
</style>
