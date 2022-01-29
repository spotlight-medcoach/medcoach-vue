
<template>
	<div id="manual-notes" class="h-100">
		<quill-editor
			class="h-100"
			ref="noteQuillEditor"
			v-model="content"
			:options="editorOption"
			@change="savedNotes = false"
			@blur="onEditorBlur($event)"
		/>
		<b-button
			class="save-button w-100 position-absolute"
			variant="primary"
			@click="saveNote"
			:disabled="savingNotes"
		>
			{{ savingNotes ? 'Guardando notas ...' : 'Guardar notas' }}
			<b-spinner small v-if="savingNotes"></b-spinner>
			<b-icon v-if="savedNotesCheck === true" icon="check" />
			<b-icon v-if="savedNotesCheck === false" icon="x" />
		</b-button>
	</div>
</template>
<script>
export default {
	props: {
		manual_id: {
			type: String,
			default: undefined
		},
		notes: {
			type: String,
			default: ''
		}
	},
	computed: {
		editor () {
			return this.$refs.noteQuillEditor.quill
		}
	},
	watch: {
		notes () {
			this.content += '<br>' + this.notes
		}
	},
	data () {
		return {
			content: '',
			savingNotes: false,
			savedNotesCheck: undefined,
			savedNotes: true,
			saveOnTimelapseListener: undefined,
			saveOnTimelapseLastState: '',
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
			}
		}
	},
	async created () {
		await this.getManualNote()
	},
	mounted () {
		window.toastr.options = {
			positionClass: 'toast-bottom-right'
		}
	},
	methods: {
		getManualNote () {
			return this.$axios
				.get(`/manuals/note?manual_id=${this.manual_id}`)
				.then((res) => {
					this.editor.clipboard.dangerouslyPasteHTML(res.data.note)
					this.finished = res.data.finished
					this.$emit('isFinished', this.finished)
					this.autoSave()
				}).catch((err) => {
					console.log(err)
				})
		},
		copyText () {
			this.editor.clipboard.dangerouslyPasteHTML(this.cursor_index, this.html_selection)
		},
		onEditorBlur (event) {
			this.cursor_index = event.selection.savedRange.index
			this.cursor_index = event.getLength()
		},
		async saveNote () {
			if (this.content.trim() === '') {
				this.$toastr.error('Su nota está vacía', 'Error')
				return false
			}
			const params = {
				manual_id: this.manual_id,
				body: this.content
			}
			this.savingNotes = true
			const data = await this.$store.dispatch('manuals/saveNote', params)
			if (data) {
				this.savedNotes = true
				this.savedNotesCheck = true
				setTimeout(() => { this.savedNotesCheck = undefined }, 1000)
			} else {
				this.savedNotesCheck = false
			}
			this.savingNotes = undefined
		},
		autoSave () {
			this.saveOnTimelapseListener = setInterval(function () {
				if (this.saveOnTimelapseLastState !== this.content) {
					this.saveNote()
					this.saveOnTimelapseLastState = this.content
				}
			}.bind(this), 30000)
		}
	},
	beforeRouteLeave () {
		clearInterval(this.saveOnTimelapseListener)
	}
}
</script>
<style lang="scss">
	@import '@/assets/css/variables/color-palette.scss';
	#manual-notes {
		position: relative;
		.quill-editor {
			.ql-container {
				position: relative;
				height: calc(100% - 98px);
				*:hover::-webkit-scrollbar-track {
					background: transparent;
				}
				.b-button {
					bottom: 0;
				}
			}
		}
		.ql-toolbar.ql-snow {
			padding: 16px 0;
			.ql-formats {
				margin-right: 0;
			}
		}
		.save-button {
			bottom: 0
		}
	}
</style>
