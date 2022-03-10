<template>
	<section id="diagnostic-test-question">
		<div
			class="questions"
		>
			<div class="mb-40px">
				<div
					class="mb-10px position-relative d-flex cursor-pointer"
					v-for="(ans, index2) in question.id.answers"
					:key="`answer-radio-${index2}`"
				>
					<b-form-radio
						:id="`answer-radio-${index2}`"
						:name="`answer-radio-${index2}`"
						v-bind:value="ans.id"
						v-model="response"
						@change="setAnswer"
						class="mr-16px cursor-pointer"
					/>
					<label
						:id="`answer-radio-${index2}`"
						v-html="ans.html"
						class="cursor-pointer"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
export default {
	props: {
		question: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			response: 0
		}
	},
	watch: {
		'question._id' (newVal) {
			if (newVal) {
				this.response = this.question.response
			}
		}
	},
	methods: {
		setAnswer () {
			this.$emit('onSetResponse', this.response)
		}
	},
	created () {
		this.response = this.question.response
	}
}
</script>
<style lang="scss">
#diagnostic-test-question {
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
