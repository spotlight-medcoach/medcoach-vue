<template>
	<div id="review">
		<b-container>
			<div v-if="onHttpRequest">
				<loading-state :message="message" />
			</div>
			<div v-else-if="errorHttp">
				<p>{{ message }}</p>
			</div>
			<div v-else>
				<NoteReview
					v-if="current_component == 'note_review'"
					:manual_id="manual_id"
					:notes="notes"
					:review="review"
					@setCurrentComponent="setCurrentComponent"
				/>
				<FlashcardsList
					v-else-if="current_component == 'flashcards_list'"
					:manual_title="manualTitle"
					@setCurrentComponent="setCurrentComponent"
				/>
				<FlashcardsStudy
					v-else-if="current_component == 'flashcards_study'"
					@setCurrentComponent="setCurrentComponent"
				/>
				<FlashcardForm
					v-else-if="current_component == 'flashcard_form'"
					@setCurrentComponent="setCurrentComponent"
				/>
			</div>
		</b-container>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import NoteReview from '@/components/review/NoteReview.vue'
import FlashcardsList from '@/components/review/FlashcardsList.vue'
import FlashcardsStudy from '@/components/review/FlashcardsStudy.vue'
import FlashcardForm from '@/components/review/FlashcardForm.vue'

export default {
	layout: 'new_default',
	components: {
		LoadingState,
		NoteReview,
		FlashcardsList,
		FlashcardsStudy,
		FlashcardForm
	},
	data () {
		return {
			manual_id: this.$route.query.manual_id,
			review: this.$route.query.review === 'true',
			notes: '',
			current_component: 'flashcards_list'
		}
	},
	beforeRouteLeave (to, from, next) {
		// this.$refs.notes.finalize()
		next()
	},
	async created () {
		let flag = false
		if (!this.onHttpRequest) {
			flag = true
			this.$store.dispatch('http_request/initHttpRequest')
		}
		await this.getManualNote(this.manual_id)
		await this.getFlashcards(this.manual_id)
		if (flag) {
			this.$store.commit('http_request/setOnHttpRequest', false)
		}
	},
	computed: {
		...mapState({
			onHttpRequest: state => state.http_request.onHttpRequest,
			message: state => state.http_request.message,
			errorHttp: state => state.http_request.errorHttp,
			topics: state => state.topics.data
		}),
		...mapGetters({
			flashcards: 'flashcards/flashcards'
		}),
		manualTitle () {
			let name = ''
			this.topics.some((topic) => {
				return topic.subtopics.some((subtopic) => {
					return subtopic.manuals.some((manual) => {
						if (manual.id === this.manual_id) {
							name = manual.name
							return true
						}
						return false
					})
				})
			})
			return name
		}
	},
	methods: {
		getManualNote (manualId) {
			return this.$axios
				.get(`/manuals/note?manual_id=${manualId}`)
				.then((res) => {
					this.notes = res.data.note
				}).catch((err) => {
					console.log(err)
					this.error_http = true
					this.message = 'Ocurrió un error al obtener sus notas'
				})
		},
		getFlashcards (manualId) {
			return this.$store.dispatch('flashcards/fetchFlashcardsByManualId', manualId)
				.catch((err) => {
					console.log(err)
					this.error_http = true
					this.message = 'Ocurrió un error al obtener sus flashcards'
				})
		},
		setCurrentComponent (component) {
			this.current_component = component
		}
	}
}
</script>
<style>
	#review .ql-toolbar {
		display: flex !important;
		justify-content: center !important;
	}
</style>
