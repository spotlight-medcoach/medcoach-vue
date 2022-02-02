<template>
	<div id="manual" class="p-2">

		<div v-if="error_http" style="font-size: 28px;">
			{{ message_error }}
		</div>

		<!-- MANUAL CONTENT -->
		<section class="general-container">
			<!----------------------------------------------------------------- NAVBAR -->
			<article class="shadow-sm m-2 mb-3">
				<manual-navbar
					:manual_id="manual_id"
					:allowFinishManual="!finished && !finish_manual_extra"
					@onChangeFontSize="changeFontSize"
					@onChangeBrightness="changeBrightness"
					@onFinishManual="finishManual"
				></manual-navbar>
			</article>
			<!----------------------------------------------------------------- DOCUMENT FILE HTML -->
			<article>
				<manual-document
					class="shadow-sm full m-2 mb-3"
					:manual_id="manual_id"
					:brightness="brightness"
					:font_size="font_size"
					@onFetchedManual="allowFlashCards"
					@onCopyToFlashCard="copyToFlashCard"
					@onCopyToNotes="copyToNotes"
				/>
			</article>
			<!----------------------------------------------------------------- FLASHCARDS -->
			<manual-flashcard
				v-if="showFlashCards"
				:manual_id="manual_id"
				:brightness="brightness"
				:flash_b="flash_b"
			/>
		</section>
		<!-- END MANUAL CONTENT -->
		<!-- NOTES CONTENT -->
		<section class="quill-notes-container shadow-sm full m-2 px-3 pb-3">
			<!----------------------------------------------------------------- NOTES -->
			<article class="h-100">
				<client-only>
					<manual-notes
						:manual_id="manual_id"
						:notes="notes"
						@isFinished="getFinishedState"
					/>
				</client-only>
			</article>
		</section>
		<!-- END NOTES CONTENT -->
		<!--------------------------------------------------------------------- NO SÉ -->
		<modal-image />
		<b-modal
			id="modal-before-leave"
			title="Confirmación"
			cancel-title="Cancelar"
			cancel-variant="danger"
			centered
			@ok="next"
			@cancel="redirect"
		>
			<p class="my-2">
				¿Quieres salir de está página?
			</p>
			<p class="my-2">
				Recuerda que el progreso no guardado de tus notas se perderá, para guardar tus notas, da clic en el icono de guardado.
			</p>
		</b-modal>
	</div>
</template>

<script>
import brightnessStates from '@/assets/json/brightness.json'
import ManualNavbar from '@/components/manual/manualNavbar.vue'
import ManualFlashcard from '@/components/manual/manualFlashcard.vue'
import ManualDocument from '@/components/manual/manualDocument.vue'
import ManualNotes from '@/components/manual/manualNotes.vue'
import ModalImage from '@/components/ModalImage'
export default {
	components: {
		ManualNavbar,
		ManualFlashcard,
		ManualDocument,
		ManualNotes,
		ModalImage
	},
	layout: 'new_default',
	data () {
		return {
			next: () => true,
			from: null,
			manual_id: this.$route.query.manual_id,
			is_extra: (this.$route.query.extra === 'true'),
			finish_manual_extra: (this.$route.query.finishManualExtra === 'true'),
			selectedImage: '',
			finished: true,
			font_size: 1,
			brightness: brightnessStates.light,
			showFlashCards: false,
			flash_a: '',
			flash_b: '',
			notes: 'Cargando notas...',
			message_error: 'Ocurrió un error su petición',
			error_http: false
		}
	},
	methods: {
		allowFlashCards () {
			this.showFlashCards = true
		},
		changeFontSize (fontSize) {
			this.font_size = fontSize
		},
		changeBrightness (brightnessState) {
			this.brightness = brightnessState
		},
		getFinishedState (isFinished) {
			this.finished = isFinished
		},
		copyToFlashCard (htmlSelection) {
			this.flash_b = htmlSelection
		},
		copyToNotes (htmlSelection) {
			this.notes = htmlSelection
		},
		finishManual () {
			this.$axios
				.put('/students/syllabus', {
					manual_id: this.manual_id,
					extra: this.is_extra
				})
				.then((res) => {
					console.log(res.data)
					this.$store.dispatch('fetchSyllabus')
					this.$router.push({ path: '/dashboard' })
				}).catch((err) => {
					this.error_http = true
					this.message_error = err.response.data.message
				})
		},
		async beforeLeave () {
			if (!this.savedNotes) {
				this.$toastr.success('Guardando las Notas antes de salir', 'Espere un momento')
				const params = {
					manual_id: this.manual_id,
					body: this.content
				}
				this.savingNotes = true
				const data = await this.$store.dispatch('manuals/saveNote', params)
				if (data) {
					this.savedNotes = true
				}
				this.savingNotes = false
			}
			this.$router.push({
				name: 'dashboard'
			})
		},
		redirect () {
			this.next(this.from)
		}
	},
	beforeRouteLeave (to, from, next) {
		if (!this.savedNotes) {
			this.$bvModal.show('modal-before-leave')
			this.next = next
			this.from = from
		} else {
			next()
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/_student_main.scss';
	#manual {
		display: grid;
		grid-template-columns: 3fr minmax(340px, 1fr);
		grid-template-areas: "main notes";
		.general-container {
			grid-area: main;
			position: relative;
			.shadow-sm.full {
				height: calc( #{$student-main-content-height} - 3rem - 60px );
			}
		}
		.quill-notes-container {
			grid-area: notes;
			overflow-y: auto;
			&.shadow-sm.full {
				height: calc( #{$student-main-content-height} - 2rem );
			}
		}
		section.shadow-sm,
		article.shadow-sm {
			background-color: #fff;
		}
		.shadow-sm.full {
			overflow-y: auto;
		}
	}
</style>
<style lang="scss">
	#manual {
		.ql-container,
		.ql-toolbar {
			border: none !important;
		}
		.ql-toolbar {
			border-bottom: 1px solid #000 !important;
			text-align: center;
		}
	}
</style>
