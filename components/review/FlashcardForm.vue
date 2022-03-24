<template>
	<section id="flashcard-form">
		<!----------------------------- Encabezado -->
		<FlashcardsListHeader
			:manual_title="manual_title"
			:back_component="back_component"
			hide_reprod_options
			@setCurrentComponent="$emit('setCurrentComponent', $event)"
			class="mb-90px"
		/>
		<!--------------------------- Formularios ---->
		<div class="d-flex align-items-center justify-content-between mb-32px">
			<!----------------------- Parte Frontal -->
			<div class="flashcard-edition flashcard-edition-frente">
				<!------------------ QuillEditor -->
				<quill-editor
					ref="noteQuillEditor"
					v-model="form.body_note"
					:options="editorOption"
				/>
			</div>
			<!------------------------ Flechitas xD --->
			<div>
				<RepeatAltIcon/>
			</div>
			<!------------------------ Parte Trasera -->
			<div class="flashcard-edition flashcard-edition-detras">
				<!------------------ QuillEditor -->
				<quill-editor
					ref="noteQuillEditor"
					v-model="form.body_user"
					:options="editorOption"
				/>
			</div>
		</div>
		<!----------------- Botón para actualizar -->
		<div class="text-right">
			<b-overlay
				:show="loading"
				spinner-small
				class="d-inline-block"
			>
				<b-button
					variant="primary"
					@click="saveFlashcard"
				>
					Actualizar
				</b-button>
			</b-overlay>
		</div>
	</section>
</template>
<script>
import { mapGetters } from 'vuex'
import FlashcardsListHeader from '@/components/review/flashcards_list/FlashcardsListHeader'
import RepeatAltIcon from '@/components/icons/RepeatAltIcon'

export default {
	props: {
		manual_title: {
			type: String,
			required: true
		}
	},
	components: {
		FlashcardsListHeader,
		RepeatAltIcon
	},
	data () {
		return {
			loading: false,
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
			form: {
				body_note: '',
				body_user: ''
			},
			manual_id: this.$route.query.manual_id,
			content: ''
		}
	},
	computed: {
		...mapGetters({
			flashcard: 'flashcards/selectedFlashcard'
		}),
		back_component () {
			return 'flashcards_list'
		}
	},
	methods: {
		async saveFlashcard () {
			let response = null
			this.loading = true
			if (this.form.body_note.trim() === '') {
				this.$toastr.error('Debes introducir el contenido de la parte frontal de la flashcard', 'Error')
				return false
			}
			if (this.form.body_user.trim() === '') {
				this.$toastr.error('Debes introducir el contenido de la parte trasera de la flashcard', 'Error')
				return false
			}
			if (this.flashcard) {
				const params = {
					flashcard_id: this.flashcard._id,
					body_note: this.form.body_note,
					body_user: this.form.body_user
				}
				response = await this.$store.dispatch('flashcards/updateFlashcard', params)
			} else {
				const params = {
					manual_id: this.manual_id,
					body_note: this.form.body_note,
					body_user: this.form.body_user
				}
				response = await this.$store.dispatch('flashcards/createFlashcard', params)
			}
			if (response) {
				this.$emit('setCurrentComponent', this.back_component)
			}
			this.loading = false
		}
	},
	created () {
		if (this.flashcard) {
			this.form.body_note = this.flashcard.body_note
			this.form.body_user = this.flashcard.body_user
		}
	},
	destroyed () {
		this.$store.commit('flashcards/setFlashcardId', null)
	}
}
</script>
<style lang="scss">
	#flashcard-form {
		padding-top: 30px;
		padding-bottom: 20px;

		.flashcard-edition {
			width: 543px;
			padding: 15px 29px;
			background: #FFFFFF;
			border: 1px solid #979797;
			box-sizing: border-box;
			border-radius: 14px 0px 14px 14px !important;
			position: relative;

			&::before {
				position: absolute;
				right: -1px;
				top: -34px;
				font-size: 1rem;
				border-top-left-radius: 14px !important;
				border-top-right-radius: 14px !important;
				padding: 4px 1rem !important;
				border: thin solid;
				border-color: #979797 #979797 #fff !important;
				display: block;
				background-color: white;
			}

			&-frente::before {
				content: "Frente";
			}

			&-detras {
				&::before {
					content: "Detrás";
				}
			}
		}

		.quill-editor {
			display: flex;
			flex-direction: column-reverse;

			.ql-container {
				border: none;
				height: 17rem !important;
				overflow-y: auto;
			}

			.ql-toolbar {
				border: none;
				border-top: 1px solid #ccc;
			}
		}
	}
</style>
