<template>
	<b-modal
		id="validate-phone-modal"
		ref="validate-phone-modal"
		size="sm"
		title="Necesitamos verificar tu número telefónico"
		cancel-title="Cancelar"
		cancel-variant="light"
		title-class="w-100 pl-4 text-center"
		body-class="py-0"
		:visible="false"
		centered
	>
		<template #modal-header-close>
			<b-icon icon="x" font-scale="1.1" />
		</template>
		<b-form id="verification-code-form" name="verification-code-form" @submit.prevent="validatePhone">
			<b-form-group label="Código" label-for="verification_code">
				<b-form-input
					id="verification_code"
					v-model="form.verification_code"
					minlength="6"
					maxlength="6"
					placeholder="000000"
					required
				/>
			</b-form-group>
		</b-form>
		<template #modal-footer>
			<b-button type="submit" form="verification-code-form" variant="primary">
				Verificar
			</b-button>
		</template>
	</b-modal>
</template>
<script>
export default {
	name: 'ValidatePhoneModal',
	props: {
		email: {
			type: String,
			default: ''
		}
	},
	watch: {
		email (change) {
			this.form.email = change
		}
	},
	data () {
		return {
			form: {
				email: '',
				verification_code: ''
			}
		}
	},
	methods: {
		validatePhone () {
			const form = {
				email: this.form.email,
				verification_code: this.form.verification_code
			}
			if (form.email) {
				this.$axios.$post('/students/validate/phone', form).then(
					(result) => {
						this.$emit('onPhoneValid', result)
						this.$refs['validate-phone-modal'].hide()
					},
					(error) => {
						if (error.response) {
							this.$toastr.error(error.response.data.message, 'Error')
						}
					}
				)
			}
		}
	},
	mounted () {
		this.form.email = this.email
	}
}
</script>
<style lang="scss">
</style>
