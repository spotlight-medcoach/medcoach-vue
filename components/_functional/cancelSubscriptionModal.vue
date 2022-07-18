<template>
	<b-modal id="cancel-subscription-modal" centered hide-footer hide-header-close>
		<template #modal-title>
			<p class="title">¿Deseas desactivar tu cuenta?</p>
		</template>
		<div class="report-wrapper">
			<p>Esto limitará el acceso a la plataforma.</p>
			<p>No podrás:</p>
			<ul>
				<li>Estudiar  manuales.</li>
				<li>Hacer o visualizar tus notas.</li>
				<li>Hacer o visualizar flashcards.</li>
				<li>Hacer o visualizar simuladores.</li>
			</ul>
			<p>Solo se dará acceso a tu perfil en caso de querer reactivarla.</p>
			<p>En caso de reactivarla, se te cobrará la mensualidad ($660 MXN) en curso incluso si desactivaste tu cuenta en el mismo mes.</p>
			<p>¿Deseas desactivar tu cuenta?</p>
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
						variant="danger"
						@click="cancelSubscription"
					>
						Sí, desactivar
					</b-button>
				</b-overlay>
			</div>
		</div>
	</b-modal>
</template>

<script>
export default {
	name: 'cancel-subscription',
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
			this.$bvModal.hide('cancel-subscription-modal')
			this.$store.commit('setShowStudentHeader', true)
		},
		cancelSubscription () {
			this.$emit('onCancelSubscription')
		}
	}
}
</script>

<style lang="scss">
#cancel-subscription-modal {
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
}
</style>
