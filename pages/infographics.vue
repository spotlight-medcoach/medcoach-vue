<template>
	<div id="infographics" class="p-2">
		<template v-if="loadStatus === true">

			<!--  EXTRA CONTENT (LEFT) -->
			<section class="manuals-container">
				<article class="shadow-sm full m-2 mb-3 p-3">
					<!-------------------------------------------------------------------- Topics -->
					<div class="topics-container m-4">
						<div
							v-for="(manual, index) in topics"
							:key="manual._id"
							class="topic-item cursor-pointer my-3"
							:class="{'selected subheader-xl font-weight-utra-bolder': index === selectedTopicIdx}"
							@click="selectTopic(index)"
						>
							{{manual.name}}
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

				</article>
			</section>

			<!-- MAIN CONTENT (RIGHT) -->
			<section class="infographics-container">
				<article class="shadow-sm full m-2 mb-3 p-5">
					<!-------------------------------------------------------------------- Infographics Header -->
					<div class="infographics-controls">
						<div />
						<h3 class="header-md text-center mb-4">SpotlightMed Infographics</h3>
						<div>
							<b-icon icon="dash" class="h4 m-2 pointer" @click="changeInfographicCardSize(-1)" />
							<b-icon icon="plus" class="h4 m-2 pointer" @click="changeInfographicCardSize(1)" />
						</div>
					</div>
					<!-------------------------------------------------------------------- Infographics Content -->
					<div class="d-flex flex-wrap justify-content-around">
						<div
							v-for="(infographic, index) in infographics"
							:key="index"
							@click="selectedInfographicIdx = index"
							v-b-modal.infographic-modal
							class="infographic-item p-4"
						>
							<div class="font-weight-utra-bolder">
								{{infographic.title}}
							</div>
							<img
								:src="infographic.image"
								:style="{'width': infographicCardSize+'px', 'height': infographicCardSize+'px'}"
								:alt="infographic.title"
							>
						</div>
					</div>
				</article>
			</section>

			<!--------------------------------------------------------------------------- Infographic Modal -->
			<b-modal
				id="infographic-modal"
				ref="infographic-modal"
				v-if="selectedInfographic"
				:title="selectedInfographic.title"
				header-text-variant="light"
				size="lg"
				centered
			>
				<div slot="modal-header-close">
					<b-icon icon="x" font-scale="2"></b-icon>
				</div>
				<b-carousel
					id="carousel-1"
					v-model="selectedInfographicIdx"
					:interval="4000"
					controls
				>
					<b-carousel-slide
						v-for="(infographic, index) in infographics"
						:key="index"
						:img-src="infographic.image"
					></b-carousel-slide>
				</b-carousel>
				<div slot="modal-footer" class="mx-auto mt-4">
					<holdable-button
						class="rounded p-2"
						message="Marcar como aprendido"
						:maxWidth="300"
						@onCheck="markAsLearned"
					>
					</holdable-button>
				</div>
			</b-modal>

		</template>

		<!-- ERROR DE CARGA -->
		<template v-else-if="loadStatus === false">
			Ijole no se arma
		</template>

		<!-- LOADING -->
		<template v-else>
			<section class="manuals-container">
				<article class="shadow-sm full m-2 mb-3 p-3">
					<div class="topics-container m-4">
						<b-skeleton v-for="index in 5" :key="index" class="mb-3" :width="`${skeletonWidth(60, 100)}%`"/>
					</div>
					<hr>
					<div class="subtopics-container m-4">
						<b-skeleton v-for="index in 9" :key="index" class="mb-3" :width="`${skeletonWidth(60, 100)}%`"/>
					</div>
				</article>
			</section>
			<section class="infographics-container">
				<article class="shadow-sm full m-2 mb-3 p-5">
					<loading-state
						message="Estamos obteniendo tus resultados"
					/>
				</article>
			</section>
		</template>

	</div>
</template>

<script>
import { mapState } from 'vuex'
import { getRandomNumberBetween } from '@/helpers/skeleton.js'
import LoadingState from '@/components/LoadingState.vue'
import HoldableButton from '@/components/_functional/holdableButton.vue'
const template = [
	{
		_id: '1',
		title: 'Adrenalina',
		image: require('@/assets/images/infographics/Adrenalina.png'),
		isLearned: true,
		createdOn: '2021/02/01',
		learnedOn: '2021/02/01',
		subtopic_id: 'x'
	},
	{
		_id: '2',
		title: 'Alfa agonistas',
		image: require('@/assets/images/infographics/Alfa agonistas.png'),
		isLearned: true,
		learnedOn: '2021/02/02',
		subtopic_id: 'x'
	},
	{
		_id: '3',
		title: 'Angina de Prinzmetal',
		image: require('@/assets/images/infographics/Angina de Prinzmetal.png'),
		isLearned: true,
		learnedOn: '2021/02/03',
		subtopic_id: 'x'
	},
	{
		_id: '4',
		title: 'Antiarritmicos 4',
		image: require('@/assets/images/infographics/Antiarritmicos 4.png'),
		isLearned: true,
		learnedOn: '2021/02/04',
		subtopic_id: 'x'
	},
	{
		_id: '5',
		title: 'Antiarrítmicos 1',
		image: require('@/assets/images/infographics/Antiarrítmicos 1.png'),
		isLearned: true,
		learnedOn: '2021/02/06',
		subtopic_id: 'x'
	},
	{
		_id: '6',
		title: 'Antiarrítmicos 2',
		image: require('@/assets/images/infographics/Antiarrítmicos 2.png'),
		isLearned: true,
		learnedOn: '2021/02/05',
		subtopic_id: 'x'
	},
	{
		_id: '7',
		title: 'Antiarrítmicos 3',
		image: require('@/assets/images/infographics/Antiarrítmicos 3.png'),
		isLearned: true,
		learnedOn: '2021/02/09',
		subtopic_id: 'x'
	},
	{
		_id: '8',
		title: 'Antiarrítmicos ventriculares',
		image: require('@/assets/images/infographics/Antiarrítmicos ventriculares.png'),
		isLearned: true,
		learnedOn: '2021/02/08',
		subtopic_id: 'x'
	},
	{
		_id: '9',
		title: 'Antiarrítmicos(1)',
		image: require('@/assets/images/infographics/Antiarrítmicos(1).png'),
		isLearned: true,
		learnedOn: '2021/02/07',
		subtopic_id: 'x'
	},
	{
		_id: '10',
		title: 'Antiarrítmicos',
		image: require('@/assets/images/infographics/Antiarrítmicos.png'),
		isLearned: true,
		learnedOn: '2021/02/12',
		subtopic_id: 'x'
	},
	{
		_id: '11',
		title: 'Antihipertensivos 1',
		image: require('@/assets/images/infographics/Antihipertensivos 1.png'),
		isLearned: true,
		learnedOn: '2021/02/10',
		subtopic_id: 'x'
	},
	{
		_id: '12',
		title: 'Antihipertensivos 2',
		image: require('@/assets/images/infographics/Antihipertensivos 2.png'),
		isLearned: true,
		learnedOn: '2021/02/11',
		subtopic_id: 'x'
	}
]
export default {
	components: {
		LoadingState,
		HoldableButton
	},
	layout: 'new_default',
	data () {
		return {
			loadStatus: undefined,
			selectedTopicIdx: 0,
			selectedSubtopicIdx: 0,
			selectedInfographicIdx: 0,
			infographicCardSize: 300
		}
	},
	computed: {
		subtopics () {
			return this.topics[this.selectedTopicIdx].subtopics
		},
		infographics () {
			return template
		},
		selectedInfographic () {
			return template[this.selectedInfographicIdx]
		},
		...mapState({
			topics: state => state.topics.data
		})
	},
	mounted () {
		if (!this.$store.state.topics.fetchedManuals) {
			this.getAllManuals()
		} else {
			this.loadStatus = true
		}
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
					console.log(err)
					this.loadStatus = false
				})
		},
		skeletonWidth (min, max) {
			return getRandomNumberBetween(min, max)
		},
		selectTopic (index) {
			this.selectedTopicIdx = index
			this.selectedSubtopicIdx = 0
		},
		markAsLearned () {
			console.log(this.selectedInfographicIdx)
			this.$refs['infographic-modal'].hide()
		},
		changeInfographicCardSize (change) {
			const scale = 100
			const infographicCardSize = +parseFloat(change * scale + this.infographicCardSize).toFixed(1)
			if (infographicCardSize >= 100 && infographicCardSize <= 500) {
				this.infographicCardSize = infographicCardSize
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/_student_main.scss';
	@import '@/assets/css/variables/color-palette.scss';
	#infographics {
		display: grid;
		grid-template-columns: minmax(320px, auto) 3fr;
		overflow-y: hidden;
		section {
			height: $student-main-content-height;
		}
		article.shadow-sm {
			background-color: #fff;
			overflow-y: auto;
			&.full {
				height: calc(100% - 2rem) !important
			}
		}
		.manuals-container {
			color: #{$neutral-400};
			.topic-item.selected {
				color: #{$accent_b-500};
				font-weight: 900
			}
			.subtopic-item.selected {
				color: #{$neutral-1000};
			}
		}
		.infographics-container {
			.infographics-controls {
				display: grid;
				grid-template-columns: 1fr 10fr 1fr;
			}
			.infographic-item
			{
				color: #{$main-500};
				img {
					object-fit: cover;
					object-position: center;
					width: 100%;
					transition: all 0.6s;
				}
			}
		}
	}
</style>
<style lang="scss">
	#infographic-modal {
		text-align: center;
		.modal-content {
			border: none;
			background-color: transparent;
			> * {
				border: none;
				padding: 0
			}
		}
		img {
			height: 60vh;
			object-fit: contain;
			object-position: center;
		}
		h5 {
			margin: auto;
			position: absolute;
			left: 2vw;
			right: 2vw;
		}
		.holdable-button {
			background-color: #ffffff;
			width: 260px;
		}
	}
</style>
