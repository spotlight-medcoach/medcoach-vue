<template>
	<div id="validate-phone">
		<div class="mx-auto mt-auto">
			<img
				src="@/assets/images/logo.svg"
				class="logo d-block mx-auto mb-40px"
			>
			<div class="card login-card mb-20px">
				<validation-observer ref="loginValidation">
					<b-form @submit.prevent="validatePhone">
						<div class="text-center mb-40px">
							<p class="login-title">Código de validación</p>
							<p class="login-subtitle">Ingresa el código enviado a tu celular</p>
						</div>
						<div class="mb-48px">
							<b-form-group
								id="code-grp"
								label="Código de validación"
								label-for="verification_code"
								class="mb-24px"
							>
								<validation-provider
									#default="{ errors }"
									name="código de validación"
									rules="required|min:6"
								>
									<b-form-input
										id="verification_code"
										v-model="form.verificationCode"
										trim
										type="number"
									/>
									<small class="text-danger">{{ errors[0] }}</small>
								</validation-provider>
							</b-form-group>
						</div>
						<div>
							<b-overlay :show="loginLoading" spinner-small>
								<b-button
									type="submit"
									variant="primary"
									class="d-block w-100 mb-16px"
								>
									Subir código
								</b-button>
							</b-overlay>
							<p
								class="link link-primary text-center"
								@click="console.log()"
							>
								Reenviar código
							</p>
						</div>
					</b-form>
				</validation-observer>
			</div>
		</div>
		<div class="mx-auto mt-auto mb-40px">
			<a style="color: #7D7A7A" href="#">AVISO DE PRIVACIDAD</a>
		</div>
	</div>
</template>
<script>
import { required } from '@/assets/utils/validations.js'
export default {
	layout: 'index',
    props: {
        email: {
            required: true,
            type: String
        }
    },
	data () {
		return {
			form: {
				verificationCode: ''
			},
			required,
			loginLoading: false,
			loaded: false
		}
	},
	mounted () {
		this.loaded = true
		this.$root.$emit('bv::show::modal', 'validate-phone-modal')
	},
	methods: {
		async validatePhone () {
			if (!this.loginLoading) {
				this.loginLoading = true
				const success = await this.$refs.loginValidation.validate()
				if (success) {
					try {
						await this.$axios.post('/students/validate/phone', {
							email: this.email,
							verification_code: this.form.verificationCode
						})
						this.$emit('onValidate')
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
	#validate-phone {
		height: 100vh;
		width: 100vw;
		display: flex;
		overflow-x: hidden;
		flex-direction: column;

		.logo {
			width: 238px;
		}

		.login-card {
			width: 508px;
		}

		.login-title {
			font-style: normal;
			font-weight: 750;
			font-size: 32px;
			line-height: 36px;
		}

		.login-subtitle {
			font-style: normal;
			font-weight: normal;
			font-size: 24px;
			line-height: 36px;
		}
	}
</style>
