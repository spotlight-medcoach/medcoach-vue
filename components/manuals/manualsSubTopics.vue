<template>
	<div id="manuals-subtopics">
		<h3 class="body-title-1 text-center mb-4">Materia</h3>

		<b-skeleton-wrapper :loading="!loaded"> <!-- Skeleton loading -->
			<template #loading>
				<div>
					<b-skeleton class="mb-3" width="80%" />
					<b-skeleton class="mb-3" width="90%" />
					<b-skeleton class="mb-3" width="80%" />
					<b-skeleton class="mb-3" width="90%" />
					<b-skeleton class="mb-3" width="70%" />
					<b-skeleton class="mb-3" width="90%" />
					<b-skeleton class="mb-3" width="80%" />
					<b-skeleton class="mb-3" width="80%" />
					<b-skeleton class="mb-3" width="90%" />
					<b-skeleton class="mb-3" width="80%" />
					<b-skeleton class="mb-3" width="90%" />
					<b-skeleton class="mb-3" width="70%" />
					<b-skeleton class="mb-3" width="90%" />
					<b-skeleton class="mb-3" width="80%" />
				</div>
			</template>

			<div class="subtopics-container"> <!-- Subtopics -->
				<div
					v-for="(subtopic, index) in topic.subtopics"
					:key="subtopic._id"
					class="my-3 pointer subtopic-item body-medium-3"
					:class="{'active': index === subtopic_index }"
					@click="selectSubtopic(index)"
				>
					{{ subtopic.name }}
				</div>
			</div>

		</b-skeleton-wrapper>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	computed: {
		...mapState({
			topic: state => state.topics.topic,
			subtopic_index: state => state.topics.subtopic_index,
			loaded: state => state.topics.fetchedManuals
		})
	},
	methods: {
		selectSubtopic (index) {
			this.$store.dispatch('topics/changeSubtopic', index)
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	#manuals-subtopics {
		.subtopics-container {
			color: #{$accent_b-500} !important;
		}
		.subtopic-item {
			font-weight: 300;
			margin-top: calc(1rem + 1vh) !important;
			margin-bottom: calc(1rem + 1vh) !important;
		}
		.active,
		.subtopic-item:hover {
			font-weight: 900;
		}
	}
</style>
