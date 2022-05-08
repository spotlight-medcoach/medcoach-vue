<template>
	<div id="diagnostic_test_new" class="d-flex mx-0 justify-content-center h-100">
		<div v-if="question" class="d-flex">
			<div id="right-side-questions">
				<section
					id="diagnostic-test-header-section"
					class="d-flex custom-card mb-16px"
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
					<div id="case-question">
						<div id="case-description">
							<p class="body-title-1 mb-10px">PREGUNTA {{ question_index + 1 }}</p>
							<!-- eslint-disable vue/no-v-html -->
							<p v-html="question.id.question.html" />
							<!--eslint-enable-->
						</div>
						<DiagnosticTestQuestion
							:question="question"
							@onSetResponse="setResponse"
						/>
					</div>
					<DiagnosticTestFooter
						:questions="questions"
						:question_index="question_index"
						@goToNextQuestion="nextQuestion"
					/>
				</section>
			</div>
			<DiagnosticTestAsideIndex
				:questions="questions"
				:selected-question="question"
				@onFinishTest="finishTest"
				@goToQuestion="goToQuestion"
			/>
		</div>
		<!-- <div v-else-if="error_request" class="mt-5" style="font-size: 32px;">
			{{ message_error }}
		</div> -->
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
		},
		answers () {
			return this.questions.map(question => ({
				response: question.response,
				correct: question.correct,
				marked: question.marked
			}))
		}
	},
	watch: {
		'question.marked' () {
			localStorage.setItem('diagnostic_test_answers', JSON.stringify(this.answers))
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
					question.marked = false
					return question
				})
				const localAnswers = JSON.parse(localStorage.getItem('diagnostic_test_answers'))
				if (localAnswers === null) {
					localStorage.setItem('diagnostic_test_answers', JSON.stringify(this.answers))
				} else {
					this.questions.forEach((question, index) => {
						question.response = localAnswers[index].response
						question.correct = localAnswers[index].correct
						question.marked = localAnswers[index].marked
					})
				}
				setTimeout(() => {
					this.setSizes()
				}, 1000)
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
				if (response === this.question.id.correct_answer) {
					this.question.correct = true
				} else {
					this.question.correct = false
				}
				localStorage.setItem('diagnostic_test_answers', JSON.stringify(this.answers))
			}
		},
		finishTest () {
			const body = {
				answers: this.answers.map(answer => ({
					response: answer.response,
					correct: answer.correct
				}))
			}
			this.sending_questions = true
			this.$axios
				.put('/students/diagnostic', body)
				.then((response) => {
					localStorage.removeItem('diagnostic_test_answers')
					this.$router.push({
						name: 'after_diagnostic_test'
					})
				})
				.catch((error) => {
					console.error(error)
					this.error_request = true
					this.sending_questions = false
					this.message_error = 'Lo sentimos. No se pudieron enviar las respuestas'
				})
		},
		goToQuestion (index) {
			this.question_index = index
		},
		setSizes () {
			const height = document.getElementById('diagnostic-test-aside-index').clientHeight
			const rightSideQuestions = document.getElementById('right-side-questions')
			rightSideQuestions.style.height = `${height}px`
		}
	}
}
</script>
<style lang="scss">
#diagnostic_test_new {
	padding: 10px 40px;
	background: #F8F8F8;

	#diagnostic-test-header-section {
		justify-content: end;
		align-items: center;
		padding: 15px 24px;
		font-size: 17px;
		line-height: 20px;
		width: 100%;
		label {
			margin: 0px;
		}
	}

	#question-content {
		font-size: 17px;
		padding: 24px 30px 12px 30px;
		height: calc(100% - 66px);

		#case-question {
			height: 94%;
			overflow-y: auto;
		}

		#case-description {
			margin-bottom: 40px;
		}
	}

	#right-side-questions {
		flex-grow: 1;
		min-width: 793px;
		max-width: 815px;
		margin-right: 15px;
		height: 100%;
	}

	.report-question {
		font-size: 14px;
		text-decoration: underline;
		color: #DB393F;
		cursor: pointer;
	}
}
</style>
