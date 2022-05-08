<template>
	<div id="manuals" class="p-2">
		<b-row v-if="manuals_not_found" class="text-center mt-5">
			<b-col class="mt-5">
				<h3>No se encontraron resultados</h3>
			</b-col>
		</b-row>
		<!-- MANUALS CONTENT BAR -->
		<section v-else class="general-container d-flex align-content-stretched">
			<article class="p-2"><!-- Topic Progress column -->
				<ManualsProgress
					class="shadow-sm full px-3 py-3"
					:load="load"
				/>
			</article>
			<article class="p-2"><!-- SubTopics column -->
				<ManualsSubTopics
					class="shadow-sm full px-4 py-4"
					:load="load"
				/>
			</article>
			<article class="p-2"><!-- Manual List column -->
				<div v-if="isNotes" class="d-flex align-items-center justify-content-center shadow-sm p-3 mb-3">
					<div class="text-center body-medium-3">
						Notas y Flashcards
					</div>
				</div>
				<ManualsStudyGuide
					class="shadow-sm px-4 py-4"
					:class="isNotes ? 'full reduced' : 'full'"
					:isNotes="isNotes"
				/>
			</article>
		</section>
		<!-- END MANUALS CONTENT BAR -->
	</div>
</template>

<script>
import { mapState } from 'vuex'
import ManualsProgress from '@/components/manuals/manualsProgress.vue'
import ManualsSubTopics from '@/components/manuals/manualsSubTopics.vue'
import ManualsStudyGuide from '@/components/manuals/manualsStudyGuide.vue'
// import ManualsResults from '@/components/manuals/manualsResults.vue'

export default {
	components: {
		ManualsProgress,
		ManualsSubTopics,
		ManualsStudyGuide
		// ManualsResults
	},
	layout: 'new_default',
	props: {
		isNotes: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			allManuals: [],
			manuals_not_found: false,
			load: false
		}
	},
	computed: {
		subtopics_cols () {
			if (this.isSearch) {
				return 12
			} else {
				return 9
			}
		},
		results () {
			let search = ''
			search = this.removeAccents(this.search.toLowerCase())
			if (search.length > 2) {
				return this.filterManuals(search)
			} else {
				return this.manuals
			}
		},
		containerClass () {
			if (!this.isSearch) {
				return this.default_container
			} else {
				return this.result_container
			}
		},
		...mapState({
			manuals: state => state.topics.manuals
		})
	},
	mounted () {
		if (!this.$store.state.topics.fetchedManuals) {
			this.getAllManuals()
		} else {
			this.load = true
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
					this.allManuals = res.data.topics
					this.$store.commit('topics/setTopics', this.allManuals)
					this.load = true
				})
				.catch((err) => {
					console.log(err)
					this.manuals_not_found = true
				})
		},
		filterManuals (search) {
			const manuals = this.manuals.filter((manual) => {
				return manual.low_manual.includes(search) || manual.low_subtopic.includes(search) || manual.low_subtopic.includes(search)
			})
			return manuals
		},
		removeAccents (cadena) {
			const acentos = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' }
			return cadena.split('').map(letra => acentos[letra] || letra).join('').toString()
		}
	}
}
</script>

<style lang="scss" scoped>
	@import '@/assets/css/variables/_student_main.scss';
	.general-container {
		min-height: 100%;
		> article
		{
			min-height: calc( #{$student-main-content-height} - 1rem );
			max-height: 622px;
			flex-grow: 1;
			> .shadow-sm {
				background-color: #fff;
				&.full {
					padding-top: 1.7vmax !important;
					min-height: 100%;
				}
				&.full.reduced {
					min-height: calc(100% - 56px - 1rem)
				}
			}
			&:nth-child(1) {
				flex-basis: 280px;
				max-width: 400px;
			}
			&:nth-child(2) {
				flex-basis: 240px;
				max-width: 370px;
			}
			&:nth-child(3) {
				flex-basis: 640px;
				overflow-y: scroll;
			}
		}
	}
</style>
