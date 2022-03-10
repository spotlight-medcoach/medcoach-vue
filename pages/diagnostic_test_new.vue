<template>
	<div id="diagnostic_test_new" class="d-flex mx-0 justify-content-center h-100">
		<div v-if="question">
			<div id="right-side-questions">
				<section
					id="diagnostic-test-header-section"
					class="custom-card"
				>
					<span class="mr-16px">Marcar pregunta</span>
					<ToggleSwitch
						v-model="question.marked"
					/>
				</section>
				<!-- Descripción del caso clínico -->
				<section
					id="question-content"
					class="custom-card"
				>
					<div id="case-description">
						<p class="body-title-1 mb-10px">CASO</p>
						<p v-html="question.id.question.html"></p>
					</div>
					<DiagnosticTestQuestion
						:question="question"
						@onSetResponse="setResponse"
					/>
					<DiagnosticTestFooter
						:questions="questions"
						:question_index="question_index"
						@goToNextQuestion="nextQuestion"
					/>
				</section>
			</div>
			<DiagnosticTestAsideIndex
				:questions="questions"
				:selectedQuestion="question"
				@onFinishTest="finishTest"
				@goToQuestion="goToQuestion"
			/>
		</div>
		<div v-else-if="error_request" class="mt-5" style="font-size: 32px;">
			{{ message_error }}
		</div>
		<div v-else>
			<loading-state message="Cargando preguntas, por favor espere" />
		</div>
	</div>
</template>

<script>
import DiagnosticTestFooter from '@/components/diagnostic_test/DiagnosticTestFooter'
import DiagnosticTestAsideIndex from '@/components/diagnostic_test/DiagnosticTestAsideIndex'
import DiagnosticTestQuestion from '@/components/diagnostic_test/DiagnosticTestQuestion'
import LoadingState from '@/components/LoadingState.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
export default {
	components: {
		LoadingState,
		DiagnosticTestAsideIndex,
		DiagnosticTestFooter,
		ToggleSwitch,
		DiagnosticTestQuestion
	},
	layout: 'diagnostic_test_layout',
	data () {
		return {
			questions: [],
			answers: [],
			question_index: 0,
			error_request: false,
			message_error: 'No se pudieron obtener las preguntas',
			sending_questions: false
		}
	},
	computed: {
		question () {
			if (this.questions.length) {
				return this.questions[this.question_index]
			}
			return null
		}
	},
	async created () {
		const token = localStorage.getItem('usertoken')
		if (!token) {
			alert('No tiene token')
			this.$router.push({ path: '/' })
		} else {
			this.token = token
			try {
				const response = await this.getQuestions()
				this.questions = response.data.questions.map((question) => {
					question.flag = false
					question.marked = false
					return question
				})
				let answers = JSON.parse(localStorage.getItem('diagnostic_test_answers'))
				if (answers === null) {
					answers = this.questions.map((question) => {
						return { response: null, correct: false }
					})
					localStorage.setItem('diagnostic_test_answers', JSON.stringify(answers))
				}
				this.answers = answers
				console.log('respuesta', response)
			} catch (e) {
				this.error_request = true
				console.error(e)
			}
		}
	},
	methods: {
		nextQuestion () {
			if (this.question_index < (this.questions.length - 1)) {
				this.question_index++
			}
		},
		getQuestions () {
			return new Promise((resolve, reject) => {
				this.$axios
					.get('/students/diagnostic')
					.then(response => resolve(response))
					.catch(err => reject(err))
			})
		},
		setResponse (response) {
			if (!isNaN(response)) {
				this.question.response = response
				const index = this.question_index
				this.answers[index].response = response
				if (response === this.question.id.correct_answer) {
					this.answers[index].correct = true
				} else {
					this.answers[index].correct = false
				}
				localStorage.setItem('diagnostic_test_answers', JSON.stringify(this.answers))
			}
		},
		finishTest () {
			alert('Finalizando Examen')
			return false
			/* const body = { answers: this.answers }
			this.sending_questions = true
			this.$axios
				.put('/students/diagnostic', body)
				.then((response) => {
					return new Promise((resolve, reject) => {
						setTimeout(function () {
							resolve(response)
						}, 120000)
					})
				})
				.then((response) => {
					localStorage.removeItem('diagnostic_test_answers')
					this.$router.push({ path: '/dashboard' })
				})
				.catch((error) => {
					console.error(error)
					this.error_request = true
					this.sending_questions = false
					this.message_error = 'Lo sentimos. No se pudieron enviar las respuestas'
				}) */
		},
		goToQuestion (index) {
			this.question_index = index
		}
	}
}
</script>
<style lang="scss">
#diagnostic_test_new {
	padding-top: 15px;

	#diagnostic-test-header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 24px;
		font-size: 20px;
		line-height: 24px;
		width: 100%;
	}

	#question-content {
		padding: 24px 44px 12px 44px;

		#case-description {
			margin-bottom: 60px;
		}
	}

	#right-side-questions {
		min-width: 793px;
		width: 793px;
		margin-right: 15px;
		height: 100%;
		overflow-y: auto;
	}

	.report-question {
		font-size: 14px;
		text-decoration: underline;
		color: #DB393F;
		cursor: pointer;
	}
}
</style>
