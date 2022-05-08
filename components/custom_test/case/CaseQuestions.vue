<template>
	<section id="case-questions">
		<div
			class="questions"
		>
			<div class="body-title-1 mb-10px">
				Pregunta {{question.index + 1}}
			</div>
			<div v-html="question.content"></div>
			<div class="mb-40px">
				<div
					class="mb-10px position-relative d-flex cursor-pointer"
					v-for="(ans, index2) in question.answers"
					:key="`answer-radio-${caseSelected.id}-${question.index}-${index2}`"
				>
					<b-form-radio
						:disabled="retro && ans.id !== question.response"
						:id="`answer-radio-${caseSelected.id}-${question.index}-${index2}`"
						:name="`answer-radio-${caseSelected.id}-${question.index}`"
						v-bind:value="ans.id"
						v-model="question.response"
						@change="setAnswer(question.index, question.response)"
						class="mr-16px cursor-pointer"
					/>
					<label
						:for="`answer-radio-${caseSelected.id}-${question.index}-${index2}`"
						v-html="ans.html"
						class="cursor-pointer"
						:class="{
							'correct': (retro && question.correct_answer === ans.id),
							'incorrect': (retro && ans.id !== question.correct_answer)
						}"
					/>
				</div>
			</div>
			<!-- RETRO -->
			<div v-if="retro" class="mb-5">
				<div class="body-title-1 mb-10px">Retroalimentación</div>
				<div v-html="question.retro"></div>
			</div>
			<!-- FIN RETRO -->
		</div>
	</section>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
	props: {
		retro: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			question: {},
			stop_timing: false
		}
	},
	computed: {
		...mapGetters({
			questionsByCase: 'custom_test/questionsByCase',
			caseSelected: 'custom_test/caseSelected',
			selectedQuestion: 'custom_test/selectedQuestion'
		})
	},
	watch: {
		selectedQuestion (newVal) {
			if (newVal) {
				this.$store.commit('custom_test/setQuestionTime', {
					index: this.selectedQuestion.index,
					value: 0
				})
				this.question = JSON.parse(JSON.stringify(newVal))
			}
		}
	},
	methods: {
		setAnswer (questionIndex, response) {
			this.$store.commit('custom_test/setQuestionResponse', { index: questionIndex, value: response })
		},
		async addSecondToSelectedQuestion () {
			if (this.selectedQuestion) {
				const time = this.selectedQuestion.time + 1
				this.$store.commit('custom_test/setQuestionTime', {
					index: this.selectedQuestion.index,
					value: time
				})
			}
			if (this.stop_timing) {
				return false
			}
			return await setTimeout(() => {
				return this.addSecondToSelectedQuestion()
			}, 1000)
		}
	},
	mounted () {
		this.question = JSON.parse(JSON.stringify(this.selectedQuestion))
		console.log('tracking 1')
		this.addSecondToSelectedQuestion()
	}
}
</script>
<style lang="scss">
#case-questions {
	padding-bottom: 60px;
	border-bottom: 1px solid #979797;

	.questions {
		.incorrect {
			color: red;
		}
		.correct {
			color: green;
			font-weight: bold;
		}
		.icono {
			top: -2px;
			position: absolute;
		}
	}
}
</style>
