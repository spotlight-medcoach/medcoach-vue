
<template>
	<div class="flashcards-edit" :style="showFlashCards ? 'width: 96%;' : 'width: fit-content;'">
		<transition name="slide-fade">
			<div v-if="showFlashCards">
				<div class="controls d-flex justify-content-end pr-4 pb-3">
					<b-overlay
						:show="savingFlashcard"
						rounded
						opacity="0.6"
						spinner-small
						spinner-variant="primary"
						class="d-inline-block"
						style="align-self: center;"
					>
						<img src="@/assets/icons/save.svg" width="35" class="pointer" @click="saveFlashcard">
					</b-overlay>
					<b-overlay
						:show="false"
						rounded
						opacity="0.6"
						spinner-small
						spinner-variant="primary"
						class="d-inline-block"
					>
						<img src="@/assets/icons/cancel.svg" width="35" class="pointer ml-2" @click="closeFlashcard">
					</b-overlay>
				</div>
				<div class="editors shadow-sm px-4 py-2">
					<div class="labels-editors d-flex justify-content-between">
						<div>Frente</div>
						<div>Detrás</div>
					</div>
					<div class="content-editors">
						<quill-editor
							ref="flashAQuillEditor"
							v-model="flashA"
							class="flashA"
							:options="editorOption"
						/>
						<div class="v-divider mx-3 my-1" />
						<quill-editor
							ref="flashBQuillEditor"
							v-model="flashB"
							class="flashB"
							:options="editorOption"
						/>
					</div>
				</div>
			</div>
		</transition>
		<div class="trigger pointer mx-auto" @click="showFlashCards = !showFlashCards">
			<img src="@/assets/icons/flashcard_trigger.svg" height="50px">
		</div>
	</div>
</template>

<script>
export default {
	props: {
		manual_id: {
			type: String,
			default: undefined
		},
		flash_a: {
			type: String,
			default: ''
		},
		flash_b: {
			type: String,
			default: ''
		}
	},
	watch: {
		flash_a () {
			this.flashA = this.flash_a
		},
		flash_b () {
			this.flashB = this.flash_b
			this.showFlashCards = true
		}
	},
	data () {
		return {
			flashA: '',
			flashB: '',
			editorOption: {
				modules: {
					toolbar: {
						container: [
							['bold', 'italic', 'underline'],
							[
								{ align: [] },
								{ list: 'ordered' },
								{ list: 'bullet' },
								{ indent: '-1' },
								{ indent: '+1' },
								{ color: ['#000500', '#FE9400', '#0070C0'] },
								{ background: ['#FE9400', '#FFFFFF', '#FFFF00'] }
							]
						]
					}
				}
			},
			showFlashCards: false,
			savingFlashcard: false
		}
	},
	mounted () {
		window.toastr.options = {
			positionClass: 'toast-bottom-right'
		}
	},
	methods: {
		saveFlashcard () {
			if (this.flashA.trim() === '') {
				this.$toastr.error('Debes introducir el contenido de la parte frontal de la flashcard', 'Error')
				return false
			}
			if (this.flashB.trim() === '') {
				this.$toastr.error('Debes introducir el contenido de la parte trasera de la flashcard', 'Error')
				return false
			}
			this.savingFlashcard = true
			const params = {
				manual_id: this.manual_id,
				body_note: this.flashA,
				body_user: this.flashB
			}
			this.$axios
				.post('/manuals/flashcard', params)
				.then((response) => {
					this.$toastr.success('Flashcard guardada correctamente', '¡Éxito!')
					this.closeFlashcard()
				})
				.catch((error) => {
					this.$toastr.error('Error al guardar la flashcard', 'Error')
					console.error(error)
				})
				.finally(() => {
					this.savingFlashcard = false
				})
		},
		closeFlashcard () {
			this.flashA = ''
			this.flashB = '<p></p>'
			this.showFlashCards = false
		}
	}
}
</script>
<style lang="scss">
	@import '@/assets/css/variables/color-palette.scss';
	.slide-fade-enter-active {
		transition: all .8s ease;
	}
	.slide-fade-leave-active {
		transition: all .8s ease;
	}
	.slide-fade-enter, .slide-fade-leave-to
	/* .slide-fade-leave-active below version 2.1.8 */ {
		transform: translateY(150px);
		opacity: 0;
	}
	.flashcards-edit {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 2rem;
		margin: auto;
		> div:first-child {
			.editors {
				margin-bottom: 3vh;
				> .labels-editors {
					margin-bottom: -1vw !important
				}
				> .content-editors {
					height: 140px;
					display: grid;
					grid-template-columns: 1fr auto 1fr;
					> .quill-editor {
						flex-grow: 1;
					}
				}
			}
		}
		.trigger {
			width: 50px;
			opacity: 0.15;
			&:hover {
				opacity: 1;
			}
		}
		.ql-container {
			height: 100px !important;
			overflow-y: auto
		}
		.shadow-sm {
			background-color: #fff;
			box-shadow: 0px 2px 20px rgba(#000, .24) !important;
			border-radius: 16px !important;
		}
		.v-divider {
			border-right: 2px solid #{$neutral-500};
			margin-top: 0 !important;
		}
		img.pointer:not(:hover) {
			opacity: 0.6;
		}
	}
</style>
