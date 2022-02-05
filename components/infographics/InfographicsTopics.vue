<template>
	<div id="topics">
		<b-skeleton-wrapper :loading="loadStatus == undefined">
			<!-------------------------------------------------------------------- Skeleton -->
			<template #loading>
				<div class="topics-container m-4">
					<b-skeleton v-for="index in 5" :key="index" class="mb-3" :width="`${skeletonWidth(60, 100)}%`"/>
				</div>
				<hr>
				<div class="subtopics-container m-4">
					<b-skeleton v-for="index in 9" :key="index" class="mb-3" :width="`${skeletonWidth(60, 100)}%`"/>
				</div>
			</template>
			<template v-if="loadStatus">
				<!-------------------------------------------------------------------- Topics -->
				<div class="topics-container m-4">
					<div
						v-for="(topic, index) in topics"
						:key="topic._id"
						class="topic-item cursor-pointer my-3"
						:class="{'selected subheader-xl font-weight-utra-bolder': index === selectedTopicIdx}"
						@click="selectTopic(index)"
					>
						{{topic.name}}
					</div>
				</div>
				<hr>
				<!-------------------------------------------------------------------- Sub Topics -->
				<div class="subtopics-container m-4">
					<div
						v-for="(subtopic, index) in subtopics"
						:key="subtopic._id"
						class="subtopic-item cursor-pointer my-3"
						:class="{'selected': index === selectedSubtopicIdx}"
						@click="selectedSubtopicIdx = index"
					>
						{{subtopic.name}}
					</div>
				</div>
			</template>
			<div v-else>
				{{error}}
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
			loadStatus: undefined,
			selectedTopicIdx: 0,
			selectedSubtopicIdx: 0,
			error: ''
		}
	},
	computed: {
		subtopics () {
			return this.topics[this.selectedTopicIdx].subtopics
		},
		...mapState({
			topics: state => state.topics.data
		})
	},
	methods: {
		getAllManuals () {
			return this.$axios
				.get('/topics', {
					headers: {
						Authorization: `Bearer ${this.$store.state.token}`
					}
				})
				.then((res) => {
					this.$store.commit('topics/setTopics', res.data.topics)
					this.loadStatus = true
				})
				.catch((err) => {
					this.error = err
					this.loadStatus = false
				})
		},
		skeletonWidth (min, max) {
			return getRandomNumberBetween(min, max)
		},
		selectTopic (index) {
			this.selectedTopicIdx = index
			this.selectedSubtopicIdx = 0
		}
	},
	mounted () {
		if (!this.$store.state.topics.fetchedManuals) {
			this.getAllManuals()
		} else {
			this.loadStatus = true
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
	.topic-item.selected {
		color: #{$accent_b-500};
		font-weight: 900
	}
	.subtopic-item.selected {
		color: #{$neutral-1000};
	}
</style>
