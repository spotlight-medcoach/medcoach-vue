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
					v-model="content"
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
					v-model="content"
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
				>
					Actualizar
				</b-button>
			</b-overlay>
		</div>
	</section>
</template>
<script>
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
			content: ''
		}
	},
	computed: {
		back_component () {
			return 'flashcards_list'
		}
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
				background-color: rgba(151, 151, 151, 1);

				&::before {
					content: "Detrás";
					background-color: rgba(151, 151, 151, 1);
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
