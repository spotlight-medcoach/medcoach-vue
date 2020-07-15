<template>
  <div style="margin-top:50px">
    <b-container style="margin-bottom: 400px;">
      <b-row >
        <!-- //Perfil y usuario -->
        <b-col style="margin-bottom: 50px">
          <div align="left">
            <p class="title">Perfil</p>
            <b-row class="my-1">
              <b-col >
                <label>Nombre</label>
                <b-form-input v-model="userInfo.first_name" class="inputForm input-valid" :state="null" placeholder="Nombre"></b-form-input>
              </b-col>
              <b-col >
                <label>Apellido</label>
                <b-form-input v-model="userInfo.last_name" class="inputForm input-valid" :state="null" placeholder="Apellidos"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <label>Dirección</label>
                <b-form-input v-model="userInfo.address" class="inputForm input-valid" :state="null" placeholder="Dirección"></b-form-input>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col >
                <label>Correo electrónico</label>
                <b-form-input
                  v-model="userInfo.email"
                  type="email"
                  class="inputForm input-valid"
                  :state="null"
                  placeholder="Email"
                ></b-form-input>
              </b-col>
              <b-col >
                <label>País</label>
                <b-form-input v-model="userInfo.country" class="inputForm input-valid" :state="null" placeholder="País"></b-form-input>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col >
                <label>Estado</label>
                <b-form-input v-model="userInfo.state" class="inputForm input-valid" :state="null" placeholder="Estado"></b-form-input>
              </b-col>
              <b-col >
                <label>Teléfono</label>
                <b-form-input v-model="userInfo.phone" class="inputForm input-valid" :state="null" placeholder="Teléfono"></b-form-input>
              </b-col>
            </b-row>
          </div>
        </b-col>

        <!-- //Informacion de estudio -->
        <b-col>
          <b-card>
            <b-container>
              <p class="title">Usuario</p>
              <label class="lblInfo">Fecha de examen</label>
              <b-form-datepicker id="dateExam" v-model="userInfo.test_date" class="mb-2" :disabled="true"></b-form-datepicker>
              <!-- <p>Value: '{{ userInfo.dateExam }}'</p> -->
              <label class="lblInfo">Dia de descanso</label>
              <b-form-select v-model="userInfo.free_day">
                <option :key="option.value" v-for="option in dayOptions" :value="option.value">{{option.label}}</option>
              </b-form-select>
              <!--<span>Selected: {{ userInfo.free_day }}</span>-->
            </b-container>
          </b-card>
          <b-row class="justify-content-md-center mt-3">
            <b-overlay
                    :show="saving"
                    rounded
                    opacity="0.6"
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block"
                  >
              <b-button @click="isEmailValid" variant="outline-primary">Guardar & Salir</b-button>
            </b-overlay>
          </b-row>
        </b-col>
      </b-row>
      <p class="title">Usuario</p>
      <label>Universidad</label>
      <v-select
      v-if="universitiesList.length === 0"
      key="universities"
      disabled
      placeholder="Loading..."
    ></v-select>
      <v-select v-else :options="universitiesList" :reduce="user=>user._id" v-model="userInfo.university" label="name">hola</v-select>

      <label>Especialidades</label>
      <v-select
      v-if="specialitiesList.length === 0"
      key="specialities"
      disabled
      placeholder="Loading..."
    ></v-select>
      <v-select v-else :options="specialitiesList" v-model="userInfo.speciality" :reduce="user=>user._id" label="name"></v-select>
    </b-container>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
export default {
  name: 'Configuracion',
  components: {
    vSelect
  },
  data () {
    return {
      saving: false,
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
        speciality: null
      },
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      universitiesList: [],
      specialitiesList: [],
      dayOptions: [
        {
          label: 'Ninguno',
          value: -1
        },
        {
          label: 'Lunes',
          value: 0
        },
        {
          label: 'Martes',
          value: 1
        },
        {
          label: 'Miercoles',
          value: 2
        },
        {
          label: 'Jueves',
          value: 3
        },
        {
          label: 'Viernes',
          value: 4
        },
        {
          label: 'Sabado',
          value: 5
        },
        {
          label: 'Domingo',
          value: 6
        }
      ]
    }
  },
  created () {
    this.getUniversitiesData()
    this.getSpecialitiesData()
    this.setLocalStorageValues()
  },
  mounted () {
    window.toastr.options = {
      positionClass: 'toast-bottom-right'
    }
  },
  methods: {
    getUniversitiesData () {
      this.$axios
        .get('/universities').then((res) => {
          const getList = res.data.universities
          getList.forEach((element) => {
            this.universitiesList.push(element)
          })
        }).catch((err) => {
          console.log(err)
        })
    },
    getSpecialitiesData () {
      this.$axios
        .get('/specialities').then((res) => {
          const getList = res.data.specialities
          getList.forEach((element) => {
            this.specialitiesList.push(element)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    saveDataLS () {
      if (process.client) {
        localStorage.setItem('studentData', JSON.stringify(this.userInfo))
      }
    },
    saveDataBD () {
      let token = ''
      if (process.client) {
        token = localStorage.getItem('usertoken')
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
        speciality: this.userInfo.speciality
      }
      console.log('Data:', data)
      this.saving = true
      this.$axios
        .put('/students/info', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          console.log(res.data)
          this.$toastr.success('Información guardada correctamente', '¡Éxito!')
        })
        .catch((err) => {
          console.log(err)
          this.$toastr.error('Error al guardar la información', 'Error')
        })
        .finally(() => {
          this.saving = false
        })
    },

    isEmailValid () {
      return (this.userInfo.email === '') ? console.log('') : (this.reg.test(this.userInfo.email)) ? (this.saveDataLS(), this.saveDataBD()) : console.log('El email es invalido')
    },

    setLocalStorageValues () {
      console.log('si paso por aca')
      let data = {}
      if (process.client) {
        data = localStorage.getItem('studentData')
        console.log('Data:', data)
        const dataLS = JSON.parse(data)
        console.log('este es', dataLS.free_day)

        this.userInfo.first_name = dataLS.first_name
        this.userInfo.last_name = dataLS.last_name
        this.userInfo.address = dataLS.address
        this.userInfo.email = dataLS.email
        this.userInfo.country = dataLS.country
        this.userInfo.state = dataLS.state
        this.userInfo.phone = dataLS.phone
        this.userInfo.university = dataLS.university
        this.userInfo.test_date = dataLS.test_date
        this.userInfo.free_day = dataLS.free_day
        this.userInfo.speciality = dataLS.speciality
      }
    }
  }
}
</script>
<style>
.title{
  font-size:30px;
  border-bottom:1px solid;
}
.inputForm{
  border-left: none;
  border-right: none;
  border-top: none;
  border-radius: 0;
}

.lblInfo{
  display: flex;
  text-align: start;
}
.boxInfo{
  border: solid 2px black;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 5px black;
        box-shadow: 0 0 5px black;
}
</style>
