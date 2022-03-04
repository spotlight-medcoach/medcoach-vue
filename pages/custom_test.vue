<template>
	<div id="custom_test" class="">
		<div v-if="onHttpRequest">
			<loading-state :message="message" />
		</div>
		<div v-else-if="errorHttp">
			<p>{{ message }}</p>
		</div>
		<div v-else-if="sendingAnswers">
			<loading-state message="Enviando respuestas, por favor espere" />
		</div>
		<div v-else class="h-100">
			<CustomTest ref="customTest" />
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingState from '@/components/LoadingState.vue'
import CustomTest from '@/components/custom_test/CustomTest.vue'
export default {
	layout: 'new_default',
	components: {
		LoadingState,
		CustomTest
	},
	computed: {
		...mapState({
			onHttpRequest: state => state.http_request.onHttpRequest,
			message: state => state.http_request.message,
			errorHttp: state => state.http_request.errorHttp,
			sendingAnswers: state => state.custom_test.sendingAnswers
		})
	},
	beforeRouteLeave (to, from, next) {
		this.$refs.customTest.finalize()
		next()
	},
	created () {
		if (!this.$route.query.custom_test_id) {
			alert('No hay custom test id')
			this.$router.push({ path: '/custom_test_config' })
		}
	}
}
</script>
<style>
	#custom_test {
		background: #FBFDFE !important;
	}
</style>
