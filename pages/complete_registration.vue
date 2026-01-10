<template>
  <div class="background-gray">
    <div class="only-pc">
      <div class="registration-container">
        <div class="mx-auto mt-32px">
          <img
            src="@/assets/images/MedCOACH.png"
            class="logo d-block mx-auto mb-40px"
            alt="MedCoach Logo"
          />
          <div class="card registration-card mb-20px">
            <!-- Skeleton loader -->
            <CompleteRegistrationSkeleton v-if="loading" />

            <!-- Form content -->
            <validation-observer v-else ref="registrationValidation">
              <b-form @submit.prevent="completeRegistration">
                <div class="text-center mb-32px">
                  <p class="login-title">Completar Registro</p>
                </div>

                <!-- Información básica (disabled) -->
                <div class="mb-24px">
                  <p class="login-subtitle">Información Personal</p>
                  <b-row class="my-3">
                    <b-col>
                      <b-form-group label="Nombre(s)" label-for="name">
                        <b-form-input
                          id="name"
                          v-model="studentData.name"
                          disabled
                          type="text"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <b-form-group label="Apellidos" label-for="last_name">
                        <b-form-input
                          id="last_name"
                          v-model="studentData.last_name"
                          disabled
                          type="text"
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>

                  <b-row class="my-3">
                    <b-col>
                      <b-form-group label="Universidad" label-for="university">
                        <b-form-input
                          id="university"
                          :value="
                            (studentData.university &&
                              studentData.university.name) ||
                            ''
                          "
                          disabled
                          type="text"
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row class="my-3">
                    <b-col>
                      <b-form-group label="Año de examen" label-for="exam_year">
                        <b-form-input
                          id="exam_year"
                          v-model="studentData.exam_year"
                          disabled
                          type="number"
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>
                </div>

                <!-- Información editable -->
                <div class="mb-24px">
                  <p class="login-subtitle">Completa tu Perfil</p>

                  <b-form-group label="Especialidad" label-for="speciality">
                    <validation-provider
                      #default="{ errors }"
                      name="especialidad"
                      rules="required"
                    >
                      <b-form-select
                        id="speciality"
                        v-model="form.speciality"
                        :options="specialityOptions"
                        :disabled="!specialitiesList.length"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group label="Día de descanso" label-for="rest_day">
                    <validation-provider
                      #default="{ errors }"
                      name="día de descanso"
                      rules="required"
                    >
                      <b-form-select
                        id="rest_day"
                        v-model="form.rest_day"
                        :options="restDayOptions"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group label="Foto de perfil" label-for="photo">
                    <div class="photo-upload-container">
                      <input
                        id="photo"
                        ref="photoInput"
                        type="file"
                        accept="image/*"
                        class="d-none"
                        @change="handlePhotoChange"
                      />
                      <div v-if="photoPreview" class="photo-preview">
                        <img
                          :src="photoPreview"
                          alt="Preview"
                          class="preview-image"
                        />
                        <button
                          type="button"
                          class="btn btn-sm btn-danger mt-2"
                          @click="removePhoto"
                        >
                          Eliminar foto
                        </button>
                      </div>
                      <button
                        v-else
                        type="button"
                        class="btn btn-primary"
                        @click="$refs.photoInput.click()"
                      >
                        <i class="fas fa-camera mr-2"></i>
                        Seleccionar foto
                      </button>
                    </div>
                    <small v-if="photoError && !photoFile" class="text-danger">
                      La foto de perfil es obligatoria
                    </small>
                  </b-form-group>

                  <b-row class="my-3">
                    <b-col>
                      <b-form-group label="Contraseña" label-for="password">
                        <validation-provider
                          #default="{ errors }"
                          name="contraseña"
                          rules="required|min:8"
                        >
                          <b-form-input
                            id="password"
                            v-model="form.password"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <b-form-group
                        label="Confirmar contraseña"
                        label-for="password_confirmation"
                      >
                        <validation-provider
                          #default="{ errors }"
                          name="confirmar contraseña"
                          rules="required|confirmed:contraseña"
                        >
                          <b-form-input
                            id="password_confirmation"
                            v-model="form.password_confirmation"
                            type="password"
                            placeholder="Repite la contraseña"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </div>

                <div>
                  <b-overlay :show="submitting" spinner-small>
                    <b-button
                      type="submit"
                      variant="primary"
                      class="d-block w-100 mb-5px"
                      :disabled="submitting || loading"
                    >
                      Completar Registro
                    </b-button>
                  </b-overlay>
                </div>
              </b-form>
            </validation-observer>
          </div>
        </div>
      </div>
    </div>
    <div class="only-small-device">
      <p>Este registro sólo es disponible por computadora.</p>
    </div>
  </div>
</template>

<script>
import { required, min } from '@/assets/utils/validations.js';
import CompleteRegistrationSkeleton from '@/components/register/complete-registration-skeleton.vue';

export default {
  components: {
    CompleteRegistrationSkeleton,
  },
  layout: 'index',
  data () {
    return {
      loading: true,
      submitting: false,
      token: '',
      studentData: {
        name: '',
        last_name: '',
        university: null,
        exam_year: null,
      },
      form: {
        speciality: '',
        rest_day: -1,
        photo: null,
        password: '',
        password_confirmation: '',
      },
      photoPreview: null,
      photoFile: null,
      photoError: false,
      specialitiesList: [],
      restDayOptions: [
        { value: -1, text: 'Ninguno' },
        { value: 0, text: 'Lunes' },
        { value: 1, text: 'Martes' },
        { value: 2, text: 'Miércoles' },
        { value: 3, text: 'Jueves' },
        { value: 4, text: 'Viernes' },
        { value: 5, text: 'Sábado' },
        { value: 6, text: 'Domingo' },
      ],
      required,
      min,
    };
  },
  computed: {
    specialityOptions () {
      const options = [
        {
          value: '',
          text: '-- Selecciona una especialidad',
          disabled: true,
        },
      ];
      return options.concat(
        this.specialitiesList.map((s) => ({
          value: s._id,
          text: s.name,
        })),
      );
    },
  },
  async created () {
    this.token = this.$route.query.token;
    if (!this.token) {
      this.$toastr?.error('Token de registro no válido', 'Error');
      this.$router.push('/');
      return;
    }

    // Load both in parallel but keep loading true until both complete
    await Promise.all([this.loadStudentData(), this.loadSpecialities()]);
    this.loading = false;
  },
  methods: {
    async loadStudentData () {
      try {
        const { data } = await this.$axios.get(
          `/student/registration/${this.token}`,
        );
        // Backend returns data in data.data (successResponse structure)
        this.studentData = data.data || data.payload;
      } catch (error) {
        console.error('Error loading student data:', error);
        this.$toastr?.error(
          error.response?.data?.error || 'Error al cargar datos del estudiante',
          'Error',
        );
        this.$router.push('/');
        throw error; // Re-throw to prevent loading from being set to false
      }
    },
    async loadSpecialities () {
      try {
        const { data } = await this.$axios.get('/catalogues/specialities');
        // La respuesta puede estar en data.data (si viene envuelta) o directamente en data
        const responseData = data.data || data;
        this.specialitiesList = responseData.specialities || [];
      } catch (error) {
        console.error('Error loading specialities:', error);
      }
    },
    handlePhotoChange (event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.$toastr?.error('El archivo debe ser una imagen', 'Error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.$toastr?.error('La imagen no debe exceder 5MB', 'Error');
        return;
      }

      this.photoFile = file;
      this.photoError = false;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removePhoto () {
      this.photoFile = null;
      this.photoPreview = null;
      this.photoError = false;
      if (this.$refs.photoInput) {
        this.$refs.photoInput.value = '';
      }
    },
    uploadPhoto () {
      if (!this.photoFile) {
        throw new Error('Foto requerida');
      }

      // Convert to base64 or upload to S3
      // For now, we'll convert to base64 and let the backend handle S3 upload
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Send base64 to backend, backend will upload to S3
          resolve(e.target.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(this.photoFile);
      });
    },
    async completeRegistration () {
      if (this.submitting) {
        return;
      }

      const success = await this.$refs.registrationValidation.validate();
      if (!success) {
        this.$toastr?.error(
          'Por favor corrige los errores en el formulario',
          'Error',
        );
        return;
      }

      if (!this.photoFile) {
        this.photoError = true;
        this.$toastr?.error('Debes seleccionar una foto de perfil', 'Error');
        return;
      }

      this.submitting = true;
      try {
        // Upload photo first
        const photoBase64 = await this.uploadPhoto();

        // Complete registration
        const response = await this.$axios.post(
          '/student/registration/complete',
          {
            token: this.token,
            speciality: this.form.speciality,
            rest_day: this.form.rest_day,
            photo_url: photoBase64, // Backend will handle S3 upload
            password: this.form.password,
            password_confirmation: this.form.password_confirmation,
          },
        );

        // Save token to localStorage for session management
        if (response.data && response.data.token) {
          if (process.client) {
            localStorage.setItem('usertoken', response.data.token);
            // Also save payload if needed
            if (response.data.payload) {
              localStorage.setItem(
                'userPayload',
                JSON.stringify(response.data.payload),
              );
            }
          }
        }

        this.$toastr?.success('Registro completado exitosamente', 'Éxito');

        // Redirect to diagnostic test
        setTimeout(() => {
          this.$router.push('/diagnostic_test');
        }, 1500);
      } catch (error) {
        console.error('Error completing registration:', error);
        this.$toastr?.error(
          error.response?.data?.error || 'Error al completar el registro',
          'Error',
        );
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.background-gray {
  background: rgba(238, 242, 245, 0.725005);
  min-height: 100vh;
  padding: 20px;
}

.registration-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 238px;
}

.registration-card {
  width: 602px;
  max-width: 100%;
}

.login-title {
  font-style: normal;
  font-weight: 750;
  font-size: 32px;
  line-height: 36px;
}

.login-subtitle {
  font-style: normal;
  font-weight: 750;
  font-size: 24px;
  line-height: 36px;
}

.photo-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.photo-preview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #ddd;
}
</style>
