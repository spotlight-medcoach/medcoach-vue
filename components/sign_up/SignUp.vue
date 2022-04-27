<template>
	<div id="signup">
		<div class="mx-auto mt-32px">
			<img
				src="@/assets/images/logo.svg"
				class="logo d-block mx-auto mb-40px"
			>
			<div class="card sign-up-card mb-20px">
				<validation-observer ref="loginValidation">
					<b-form @submit.prevent="signup">
						<div class="text-center mb-32px">
							<p class="login-title">Crea cuenta</p>
						</div>
						<div class="mb-24px">
                            <p class="login-subtitle">Usuario</p>
                        	<b-row class="my-3">
							    <b-col>
                                    <b-form-group
                                        id="first-name-grp"
                                        label="Nombre(s)"
                                        label-for="first_name"
                                        class="mb-5px"
                                    >
                                        <validation-provider
                                            #default="{ errors }"
                                            name="nombre(s)"
                                            rules="required"
                                        >
                                            <b-form-input
                                                id="first_name"
                                                v-model="form.first_name"
                                                trim
                                                type="text"
												placeholder="Alexander"
                                            />
                                            <small class="text-danger">{{ errors[0] }}</small>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group
                                        id="last-name-grp"
                                        label="Apellidos"
                                        label-for="last_name"
                                    >
                                        <validation-provider
                                            #default="{ errors }"
                                            name="apellidos"
                                            rules="required"
                                        >
                                            <b-form-input
                                                id="last_name"
                                                v-model="form.last_name"
                                                type="text"
												placeholder="Fleming"
                                            />
                                            <small class="text-danger">{{ errors[0] }}</small>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
                            </b-row>
							<b-row class="my-3">
							    <b-col>
                                    <b-form-group
                                        id="phone-grp"
                                        label="Teléfono"
                                        label-for="phone"
                                        class="mb-5px"
                                    >
                                        <validation-provider
                                            #default="{ errors }"
                                            name="teléfono"
                                            rules="required"
                                        >
											<vue-phone-number-input
												id="phone"
                                                v-model="form.phone"
												default-country-code="MX"
												:translations="{
													countrySelectorLabel: 'Código de país',
													countrySelectorError: 'Choisir un pays',
													phoneNumberLabel: 'Número de teléfono',
													example: 'Ejemplo :'
												}"
												:noExample="true"
												label="Teléfono"
											/>
                                            <small class="text-danger">{{ errors[0] }}</small>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
							</b-row>
							<b-row class="my-3">
								<b-col>
                                    <b-form-group
                                        id="email-grp"
                                        label="Correo electrónico"
                                        label-for="email"
                                        class="mb-5px"
                                    >
                                        <validation-provider
                                            #default="{ errors }"
                                            name="correo electrónico"
                                            rules="required|email"
                                        >
                                            <b-form-input
                                                id="email"
                                                v-model="form.email"
                                                trim
                                                type="email"
												placeholder="alexander@fleming.com"
                                            />
                                            <small class="text-danger">{{ errors[0] }}</small>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
							</b-row>
							<b-row>
								<b-col>
                                    <b-form-group
                                        id="password-grp"
                                        label="Contraseña"
                                        label-for="password"
                                    >
                                        <validation-provider
                                            #default="{ errors }"
                                            name="Contraseña"
                                            rules="required"
                                        >
                                            <b-form-input
                                                id="password"
                                                v-model="form.password"
                                                type="password"
                                                trim
												placeholder="********"
                                            />
                                            <small class="text-danger">{{ errors[0] }}</small>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
								<b-col>
                                    <b-form-group
                                        id="password-grp"
                                        label="Repetir contraseña"
                                        label-for="confirm-password"
                                    >
                                        <validation-provider
                                            #default="{ errors }"
                                            name="repetir contraseña"
                                            rules="required|confirmed:Contraseña"
                                        >
                                            <b-form-input
                                                id="confirm-password"
                                                v-model="form.confirm_password"
                                                type="password"
                                                trim
												placeholder="********"
                                            />
                                            <small class="text-danger">{{ errors[0] }}</small>
                                        </validation-provider>
                                    </b-form-group>
                                </b-col>
							</b-row>
						</div>
						<div class="mb-24px">
                            <p class="login-subtitle">Tu ENARM</p>
                            <b-row class="my-3">
							    <b-col>
									<b-form-group
                                        id="password-grp"
                                        label="Fecha en la que presentarás tu examen"
                                        label-for="enarm-date"
                                    >
                                        <validation-provider
                                            #default="{ errors }"
                                            name="fecha de ENARM"
                                            rules="required"
                                        >
											<b-form-select v-model="form.test_year" :options="years"></b-form-select>
                                            <small class="text-danger">{{ errors[0] }}</small>
                                        </validation-provider>
                                    </b-form-group>
								</b-col>
							</b-row>
						</div>
						<div>
							<b-overlay :show="loginLoading" spinner-small>
								<b-button
									type="submit"
									variant="primary"
									class="d-block w-100 mb-5px"
								>
									Crear cuenta
								</b-button>
							</b-overlay>
						</div>
					</b-form>
				</validation-observer>
			</div>
			<div class="d-flex justify-content-around px-4 pb-4">
				<span>¿Ya tienes cuenta en MedCOACH?</span>
				<router-link to="/">Inicia Sesión</router-link>
			</div>
		</div>
		<div class="mx-auto mt-auto mb-40px">
			<a style="color: #7D7A7A" href="#">AVISO DE PRIVACIDAD</a>
		</div>
	</div>
</template>
<script>
import { required, email } from '@/assets/utils/validations.js'
export default {
	layout: 'index',
	data () {
		return {
			form: {
				first_name: '',
				last_name: '',
				phone: '',
				email: '',
				password: '',
				confirm_password: '',
				test_year: (new Date()).getFullYear()
			},
			years: [
				{ value: (new Date()).getFullYear(), text: (new Date()).getFullYear() },
				{ value: (new Date()).getFullYear() + 1, text: (new Date()).getFullYear() + 1 }
			],
			required,
			email,
			loginLoading: false,
			loaded: false
		}
	},
	mounted () {
		this.loaded = true
		const input = document.querySelector('.input-tel__input')
		input.placeholder = 'Teléfono'
	},
	methods: {
		async signup () {
			if (!this.loginLoading) {
				this.loginLoading = true
				const success = await this.$refs.loginValidation.validate()
				if (success) {
					try {
						const { data } = await this.$axios.post('/students/register', this.form)
						const student = data.student
						if (student) {
							this.$emit('onSuccess', { email: student.email, password: this.form.password })
						} else {
							this.$toastr.error(data.message, 'Error')
						}
					} catch (error) {
						if (error.response) {
							this.$toastr.error(error.response.data.message, 'Error')
						}
					}
				} else {
					this.$toastr.error('Hay campos incorrectos', 'Error')
				}
				this.loginLoading = false
			}
		}
	}
}
</script>
<style lang="scss">
	#signup {
		height: 100vh;
		width: 100vw;
		display: flex;
		overflow-x: hidden;
		flex-direction: column;

		.logo {
			width: 238px;
		}

		.sign-up-card {
			width: 602px;
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
	}
</style>
