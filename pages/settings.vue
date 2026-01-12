<template>
  <div id="settings" style="padding-top: 50px">
    <div v-if="onHttpRequest" class="w-100">
      <loading-state :message="message" height="60vh" />
    </div>
    <div v-else-if="errorHttp">
      <p>{{ message }}</p>
    </div>
    <b-container v-else style="margin-bottom: 20px">
      <b-row>
        <!-- //Perfil y usuario -->
        <b-col style="margin-bottom: 50px">
          <div align="left">
            <div class="d-flex justify-content-between mb-4">
              <p class="title">Perfil</p>
              <b-overlay
                :show="saving"
                rounded
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block"
              >
                <b-button variant="primary" @click="sendForm">
                  {{ profileEnabled ? 'Guardar Cambios' : 'Editar Perfil' }}
                </b-button>
              </b-overlay>
            </div>
            <b-row class="my-3">
              <b-col>
                <label>Nombre</label>
                <b-form-input
                  v-model="userInfo.first_name"
                  class="inputForm input-valid"
                  :state="null"
                  placeholder="Nombre"
                  :disabled="!profileEnabled"
                />
              </b-col>
              <b-col>
                <label>Apellido</label>
                <b-form-input
                  v-model="userInfo.last_name"
                  class="inputForm input-valid"
                  :state="null"
                  placeholder="Apellidos"
                  :disabled="!profileEnabled"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <label>Dirección</label>
                <b-form-input
                  v-model="userInfo.address"
                  class="inputForm input-valid"
                  :state="null"
                  placeholder="Dirección"
                  :disabled="!profileEnabled"
                />
              </b-col>
            </b-row>
            <b-row class="my-3">
              <b-col>
                <label>Correo electrónico</label>
                <b-form-input
                  v-model="userInfo.email"
                  type="email"
                  class="inputForm input-valid"
                  :state="null"
                  placeholder="Email"
                  :disabled="!profileEnabled"
                />
              </b-col>
              <b-col>
                <label>País</label>
                <b-form-input
                  v-model="userInfo.country"
                  class="inputForm input-valid"
                  :state="null"
                  placeholder="País"
                  :disabled="!profileEnabled"
                />
              </b-col>
            </b-row>
            <b-row class="my-3">
              <b-col>
                <label>Estado</label>
                <b-form-input
                  v-model="userInfo.state"
                  class="inputForm input-valid"
                  :state="null"
                  placeholder="Estado"
                  :disabled="!profileEnabled"
                />
              </b-col>
              <b-col>
                <label>Teléfono</label>
                <b-form-input
                  v-model="userInfo.phone"
                  class="inputForm input-valid"
                  :state="null"
                  placeholder="Teléfono"
                  :disabled="!profileEnabled"
                />
              </b-col>
            </b-row>
          </div>
          <div align="left" class="mt-5">
            <p class="title mb-4">Usuario</p>
            <div class="my-3">
              <label>Universidad</label>
              <v-select
                v-if="universitiesList.length === 0"
                key="universities"
                disabled
                placeholder="Loading..."
              />
              <v-select
                v-else
                v-model="userInfo.university"
                :options="universitiesList"
                :reduce="(user) => user._id"
                label="name"
                :disabled="!profileEnabled"
              />
            </div>
            <div class="my-3">
              <label>Especialidades</label>
              <v-select
                v-if="specialitiesList.length === 0"
                key="specialities"
                disabled
                placeholder="Loading..."
              />
              <v-select
                v-else
                v-model="userInfo.speciality"
                :options="specialitiesList"
                :reduce="(user) => user._id"
                label="name"
                :disabled="!profileEnabled"
              />
            </div>
          </div>
          <div align="left" class="mt-5">
            <p class="title mb-4">Estudio</p>
            <div class="my-3">
              <label class="lblInfo">Fecha de examen</label>
              <b-form-datepicker
                id="dateExam"
                v-model="userInfo.test_date"
                class="mb-2"
                :disabled="true"
              />
            </div>
            <div class="my-3">
              <label class="lblInfo">Dia de descanso</label>
              <b-form-select
                v-model="userInfo.free_day"
                :disabled="!profileEnabled"
              >
                <option
                  v-for="option in dayOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </b-form-select>
            </div>
          </div>
        </b-col>
        <b-col>
          <div align="left" class="mt-5">
            <p class="title mb-4">Estudio</p>
            <div class="my-3">
              <label class="lblInfo">Fecha de examen</label>
              <b-form-datepicker
                id="dateExam"
                v-model="userInfo.test_date"
                class="mb-2"
                :disabled="true"
              />
            </div>
            <div class="my-3">
              <label class="lblInfo">Dia de descanso</label>
              <b-form-select
                v-model="userInfo.free_day"
                :disabled="!profileEnabled"
              >
                <option
                  v-for="option in dayOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </b-form-select>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import LoadingState from '@/components/LoadingState.vue';

export default {
  name: 'Configuracion',
  components: {
    vSelect,
    LoadingState,
  },
  layout: 'new_default',
  data () {
    return {
      saving: false,
      profileEnabled: false,
      userInfo: {
        first_name: '',
        last_name: '',
        address: '',
        email: '',
        country: '',
        state: '',
        phone: '',
        university: null,
        test_date: null,
        free_day: -1,
        speciality: null,
      },
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      universitiesList: [],
      specialitiesList: [],
      dayOptions: [
        {
          label: 'Ninguno',
          value: -1,
        },
        {
          label: 'Lunes',
          value: 0,
        },
        {
          label: 'Martes',
          value: 1,
        },
        {
          label: 'Miercoles',
          value: 2,
        },
        {
          label: 'Jueves',
          value: 3,
        },
        {
          label: 'Viernes',
          value: 4,
        },
        {
          label: 'Sabado',
          value: 5,
        },
        {
          label: 'Domingo',
          value: 6,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      studentInfo: (state) => state.studentInfo,
      onHttpRequest: (state) => state.http_request.onHttpRequest,
      message: (state) => state.http_request.message,
      errorHttp: (state) => state.http_request.errorHttp,
    }),
  },
  watch: {
    studentInfo (newVal) {
      if (newVal) {
        this.userInfo = JSON.parse(JSON.stringify(newVal));
      }
    },
  },

  created () {
    this.getUniversitiesData();
    this.getSpecialitiesData();
    if (this.studentInfo) {
      this.userInfo = JSON.parse(JSON.stringify(this.studentInfo));
    }
  },
  mounted () {
    window.toastr.options = {
      positionClass: 'toast-bottom-right',
    };
  },
  methods: {
    getUniversitiesData () {
      this.$axios
        .get('/catalogues/universities')
        .then((res) => {
          // La respuesta puede estar en res.data.data (si viene envuelta) o directamente en res.data
          const responseData = res.data.data || res.data;
          const getList = responseData.universities || [];
          getList.forEach((element) => {
            this.universitiesList.push(element);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getSpecialitiesData () {
      this.$axios
        .get('/catalogues/specialities')
        .then((res) => {
          // La respuesta puede estar en res.data.data (si viene envuelta) o directamente en res.data
          const responseData = res.data.data || res.data;
          const getList = responseData.specialities || [];
          getList.forEach((element) => {
            this.specialitiesList.push(element);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    saveDataLS () {
      if (process.client) {
        localStorage.setItem('studentData', JSON.stringify(this.userInfo));
      }
    },
    saveDataBD () {
      let token = '';
      if (process.client) {
        token = localStorage.getItem('usertoken');
      }

      const data = {
        first_name: this.userInfo.first_name,
        last_name: this.userInfo.last_name,
        country: this.userInfo.country,
        university: this.userInfo.university,
        free_day: this.userInfo.free_day,
        phone: this.userInfo.phone,
        state: this.userInfo.state,
        address: this.userInfo.address,
        test_date: this.userInfo.test_date,
        email: this.userInfo.email,
        speciality: this.userInfo.speciality,
      };
      this.saving = true;
      this.$axios
        .put('/student/profile', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          this.$toastr.success('Información guardada correctamente', '¡Éxito!');
          this.$store.commit('setStudentInfo', this.userInfo);
        })
        .catch((err) => {
          console.error(err);
          this.$toastr.error('Error al guardar la información', 'Error');
        })
        .finally(() => {
          this.saving = false;
          this.profileEnabled = false;
        });
    },

    sendForm () {
      if (!this.profileEnabled) {
        this.profileEnabled = true;
      } else {
        if (this.userInfo.email === '') {
          console.error('El email es invalido');
          return;
        }
        if (this.reg.test(this.userInfo.email)) {
          this.saveDataLS();
          this.saveDataBD();
        }
      }
    },
  },
};
</script>
