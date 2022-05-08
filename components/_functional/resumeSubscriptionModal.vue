<template>
	<b-modal id="resume-subscription-modal" centered hide-footer hide-header-close>
		<template #modal-title>
			<p class="title">¿Deseas reactivar tu cuenta?</p>
		</template>
		<div class="report-wrapper">
			<p>Al reactivar tu cuenta podrás:</p>
			<ul>
				<li>Estudiar  manuales.</li>
				<li>Hacer o visualizar tus notas.</li>
				<li>Hacer o visualizar flashcards.</li>
				<li>Hacer o visualizar simuladores.</li>
			</ul>
			<p>¿Qué pasa al momento de reactivarla?</p>
			<p>Al momento de reactivar tu cuenta se hará el cobro por $660 MXN a la tarjeta guardada y se tomará el día de activación como la nueva fecha de cobro.</p>
			<p>¿Deseas reactivar tu cuenta?</p>
			<div class="btn-container">
				<b-button variant="outline-light" @click="hideModal">Cancelar</b-button>
				<b-overlay
					:show="loading"
					rounded
					opacity="0.6"
					spinner-small
					spinner-variant="primary"
					class="d-inline-block"
				>
					<b-button
						variant="success"
						@click="resumeSubscription"
					>
						Sí, Reactivar
					</b-button>
				</b-overlay>
			</div>
		</div>
	</b-modal>
</template>

<script>
export default {
	name: 'resume-subscription',
	data () {
		return {
			showForm: false,
			loading: false
		}
	},
	methods: {
		showModal (event) {
			this.showForm = true
			document.body.style.overflow = 'hidden'
			this.$store.commit('setShowStudentHeader', false)
		},
		hideModal (event) {
			this.showForm = false
			this.$bvModal.hide('resume-subscription-modal')
			this.$store.commit('setShowStudentHeader', true)
		},
		resumeSubscription () {
			this.$emit('onResumeSubscription')
		}
	}
}
</script>

<style lang="scss">
#resume-subscription-modal {
	.modal-header {
		justify-content: center;
	}

	.title {
		margin-bottom: 12px !important;
	}

	p {
		margin-bottom: 18px;
	}

	.modal-content {
		width: 460px;
		padding: 15px 10px;
	}

	.title {
		font-family: "Avenir";
		font-size: 24px;
		font-weight: 800;
		line-height: normal;
		color: rgba(0, 0, 0, 1);
		text-align: center;
		margin-bottom: 48px;
	}

	.report-wrapper {
		width: 100%;

		.btn-container {
			width: 100%;
			margin-top: 45px;
			display: flex;
			justify-content: space-between;
		}

		.button {
			color: white;
			background-color: #fe9501;
			padding: 11px 82px;
			margin: 0px auto;
			border: none;
			outline: none;
			border-radius: 4px;
			display: block;
		}

		.select {
			.vs__dropdown-toggle {
				border: none !important;
				border-bottom: 1px black solid !important;
				border-radius: 0px !important;
			}

			.vs__selected {
				/* color: gray !important; */
			}

			::placeholder {
				color: gray !important;
			}
		}
	}

	.btn-outline-light {
		border: none;
		text-decoration: underline;
		color: #1D1D1B;

		&:hover {
			background-color: white;
		}
	}

	.btn-success {
		color: white;
	}
}
</style>
