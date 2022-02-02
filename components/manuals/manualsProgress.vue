<template>
	<div id="manuals-progress" class="d-flex flex-column justify-content-between">
		<b-skeleton-wrapper :loading="!load">

			<!-- Skeleton loading -->
			<template #loading>
				<div>
					<b-skeleton class="mb-5" width="80%"></b-skeleton>
					<b-skeleton class="mb-5" width="65%"></b-skeleton>
					<b-skeleton class="mb-5" width="95%"></b-skeleton>
					<b-skeleton class="mb-5" width="80%"></b-skeleton>
					<b-skeleton class="mb-5" width="65%"></b-skeleton>
					<b-skeleton class="mb-5" width="85%"></b-skeleton>
					<b-skeleton class="mb-5" width="80%"></b-skeleton>
				</div>
			</template>

			<!-- Topics -->
			<div class="topics-container d-flex flex-column justify-content-between">
				<div
					class="mb-3 cursor-pointer"
					@click="selectTopic(index)"
					@mouseover="handleHoverTopic(index, true)"
					@mouseleave="handleHoverTopic(index, false)"
					v-for="(manual, index) in topics"
					:key="manual._id"
					>
					<!-- Custom progress bar -->
					<custom-progress-bar
						:actualValue = manual.progress
						:totalValue = manual.total
						:topHeader = manual.name
						:topHint = "`${manual.progress} / ${manual.total}`"
						:colorVariant = "isHighlight(index) ? 'blue' : 'neutral'"
						v-if="manual"
					/>
				</div>
			</div>

		</b-skeleton-wrapper>

		<!-- Topics Resume -->
		<div class="total-container text-center flex-grow-1 py-2">
			<h5 class="header-md">Total vistos</h5>
			<h5 class="header-md">
				{{ total_progress }} / {{ total_manuals }}
			</h5>
		</div>
	</div>

</template>

<script>
import { mapState } from 'vuex'
import CustomProgressBar from '@/components/_functional/customProgressBar.vue'
export default {
	components: {
		CustomProgressBar
	},
	props: {
		load: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			topicIdxSelected: 0,
			topicIdxOnHover: -1
		}
	},
	computed: {
		total_progress () {
			let progress = 0
			this.topics.forEach((topic) => {
				progress += topic.progress
			})
			return progress
		},
		total_manuals () {
			let total = 0
			this.topics.forEach((topic) => {
				total += topic.total
			})
			return total
		},
		...mapState({
			topics: state => state.topics.data
		})
	},
	methods: {
		selectTopic (index) {
			this.$store.dispatch('topics/changeTopic', index)
			this.topicIdxSelected = index
		},
		handleHoverTopic (index, isOnHover) {
			this.topicIdxOnHover = isOnHover ? index : -1
		},
		isHighlight (index) {
			return index === this.topicIdxSelected || index === this.topicIdxOnHover
		}
	}
}
</script>
<style scoped>
	.topics-container {
		max-height: 600px;
	}
	.total-container {
		max-height: 90px;
	}
</style>
