<template>
	<div id="topics">
		<b-skeleton-wrapper :loading="!loadStatus">
			<!-------------------------------------------------------------------- Skeleton -->
			<template #loading>
				<div class="topics-container m-4">
					<b-skeleton v-for="index in 5" :key="index" class="mb-3" :width="`${skeletonWidth(60, 100)}%`" />
				</div>
				<hr>
				<div class="subtopics-container m-4">
					<b-skeleton v-for="index in 9" :key="index" class="mb-3" :width="`${skeletonWidth(60, 100)}%`" />
				</div>
			</template>
			<template v-if="loadStatus">
				<!-------------------------------------------------------------------- Topics -->
				<div class="topics-container m-4">
					<div
						v-for="(topic, index) in topics"
						:key="topic._id"
						class="topic-item cursor-pointer body-lg my-3"
						:class="{'selected body-title-2': index === selectedTopicIdx}"
						@click="selectTopic(index)"
					>
						{{ topic.name }}
					</div>
				</div>
				<hr>
				<!-------------------------------------------------------------------- Sub Topics -->
				<div v-if="selectedTopicIdx !== undefined" class="subtopics-container m-4">
					<div
						v-for="(subtopic, index) in subtopics"
						:key="subtopic._id"
						class="subtopic-item cursor-pointer body-lg my-3"
						:class="{'selected': index === selectedSubtopicIdx}"
						@click="selectSubtopic(index)"
					>
						{{ subtopic.name }}
					</div>
				</div>
			</template>
			<div v-else>
				{{ error }}
			</div>
		</b-skeleton-wrapper>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { getRandomNumberBetween } from '@/helpers/skeleton.js'
export default {
	name: 'InfographicsTopics',
	data () {
		return {
			selectedTopicIdx: undefined,
			selectedSubtopicIdx: undefined,
			error: ''
		}
	},
	computed: {
		subtopics () {
			return this.topics[this.selectedTopicIdx].subtopics
		},
		...mapState({
			topics: state => state.topics.data,
			loadStatus: state => state.topics.fetchedManuals
		})
	},
	methods: {
		skeletonWidth (min, max) {
			return getRandomNumberBetween(min, max)
		},
		selectTopic (index) {
			if (this.selectedTopicIdx !== index) {
				this.selectedTopicIdx = index
				this.$emit('onTopicChange', this.topics[index]._id)
			}
			this.selectedSubtopicIdx = undefined
			this.$emit('onSubtopicChange', undefined)
		},
		selectSubtopic (index) {
			if (this.selectedSubtopicIdx !== index) {
				this.selectedSubtopicIdx = index
				this.$emit('onSubtopicChange', this.subtopics[index]._id)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	.topics-container,
	.subtopics-container {
		color: #{$neutral-400};
	}
	.body-lg {
		font-weight: 300
	}
	.topic-item.selected {
		color: #{$accent_b-500};
		font-weight: 900
	}
	.subtopic-item.selected {
		color: #{$neutral-1000};
	}
</style>
