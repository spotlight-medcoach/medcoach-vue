<template>
	<div class="quote-container d-flex align-items-center justify-content-center py-2">
		<div class="quote text-center text-lg-content">
			<q>{{ quoteSelected.quote }}</q>
			<span class="author">
				- {{ quoteSelected.author }}
			</span>
		</div>
	</div>
</template>
<script>
import { quotes } from '@/assets/json/quotes.json'
export default {
	name: 'MotivationalQuote',
	data () {
		return {
			quoteSelected: {
				author: '',
				quote: ''
			}
		}
	},
	created () {
		const size = quotes.length
		if (size > 0) {
			const index = this.getRandomInt(0, size)
			this.quoteSelected = quotes[index]
		}
	},
	methods: {
		getRandomInt (min, max) {
			return Math.floor(Math.random() * (max - min)) + min
		}
	}
}
</script>
<style lang="scss" scoped>
	.quote-container {
		min-height: 68px;
		height: 100%;
		padding-left: 8vw;
		padding-right: 8vw;
	}
	.author {
		font-weight: bold;
	}
</style>
