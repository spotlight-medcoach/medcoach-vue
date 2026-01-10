<template>
  <div class="background-gray">
    <div class="only-pc">
      <sign-up v-if="screen == 'sign-up'" @onSuccess="goToValidate" />
      <validate-phone
        v-else-if="screen === 'validate-phone'"
        :email="email"
        @onValidate="goToPayment"
      />
      <payment v-else-if="screen === 'payment'" />
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
import SignUp from '@/components/sign_up/SignUp';
import ValidatePhone from '@/components/sign_up/ValidatePhone';
import Payment from '@/components/sign_up/Payment';
export default {
  components: {
    SignUp,
    ValidatePhone,
    Payment,
  },
  layout: 'index',
  data () {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    ...mapGetters({
      screen: 'sign_up/screen',
    }),
  },
  async created () {
    this.inMaintenance = process.env.IN_MAINTENANCE === 'true';
    await this.$store.dispatch('sign_up/fetchSubscriptionPlans');
  },
  methods: {
    goToValidate ({ email, password }) {
      this.email = email;
      this.password = password;
      this.$store.commit('sign_up/setScreen', 'validate-phone');
    },
    async goToPayment () {
      const { data } = await this.$axios.post('/student/auth/login', {
        email: this.email,
        password: this.password,
      });
      const student = data.payload;
      if (student) {
        if (process.client) {
          localStorage.setItem('usertoken', data.token);
          await this.$store.commit('setToken', data.token);
          await this.$store.commit('setStudentInfo', {
            ...student,
            _id: student.student_id,
          });
          this.$store.commit('sign_up/setScreen', 'payment');
        }
      } else {
        this.$toastr.error('Verifica tus claves de acceso', 'Error');
      }
    },
  },
};
</script>
<style>
.background-gray {
  background: rgba(238, 242, 245, 0.725005);
}
</style>
