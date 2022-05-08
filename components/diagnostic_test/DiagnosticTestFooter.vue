<template>
	<div id="diagnostic-test-footer" class="d-flex justify-content-between align-items-center pt-1">
		<span
			class="report-question"
			@click="$bvModal.show('report-question-modal')"
		>
			Reportar pregunta
		</span>
		<b-button
			:disabled="question_index >= questions.length - 1"
			variant="primary"
			@click="$emit('goToNextQuestion')"
			size="sm"
		>
			Siguiente
		</b-button>
		<ReportQuestionModal
			caseId="1"
		/>
	</div>
</template>
<script>
import ReportQuestionModal from '@/components/_functional/reportQuestionModal.vue'

export default {
	props: {
		question_index: {
			type: Number,
			required: true
		},
		questions: {
			type: Array,
			required: true
		}
	},
	components: {
		ReportQuestionModal
	}
}
</script>
<style lang="scss">
	#diagnostic-test-footer {
		margin-top: 10px;
		border-top: 1px solid #979797;
	}
</style>
