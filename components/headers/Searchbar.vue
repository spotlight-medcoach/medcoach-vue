<template>
	<div
		id="header-searchbar"
		@click="isSearchbarOpen=true"
		@focusout="closeSearchOptions()"
	>
		<div class="searchbar-input">
			<SearchIcon
				style="height: 17px;"
				class="mr-2"
			/>
			<input
				id="search-input"
				v-model="search"
				type="text"
			>
		</div>
		<div v-if="loaded && isSearchbarOpen" class="result-list px-0 py-2">
			<template v-if="results.length">
				<template v-for="(manual, index) in results">
					<nuxt-link
						v-if="!manual.finished"
						:key="'manual' + index"
						class="result-list-item d-flex align-items-center px-4 text-decoration-none"
						:to="`/manual?manual_id=${manual.manual_id}`"
					>
						<div class="manual-txt">{{ manual.manual_name }}</div>
						<div class="manual-ext ml-auto text-right body-xsm">
							<div><b>{{ manual.subtopic_name }}</b></div>
							<div><b>{{ manual.topic_name }}</b></div>
						</div>
					</nuxt-link>
					<div
						v-else
						:key="'manual' + index"
						class="result-list-item d-flex align-items-center px-4 text-decoration-none"
						style="opacity: 0.30"
					>
						<div class="manual-txt">
							{{ manual.manual_name }}
						</div>
						<div class="manual-ext ml-auto text-right body-xsm">
							<div><b>{{ manual.subtopic_name }}</b></div>
							<div><b>{{ manual.topic_name }}</b></div>
						</div>
					</div>
				</template>
			</template>
			<div v-else>
				<div
					class="px-4 py-2"
					style="opacity: 0.30"
				>
					<p>No se encontraron resultados</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import SearchIcon from '@/components/icons/SearchIcon.vue'
export default {
	components: {
		SearchIcon
	},
	data () {
		return {
			search: '',
			isSearchbarOpen: false
		}
	},
	computed: {
		results () {
			if (this.search.length) {
				const search = this.removeAccents(this.search.toLowerCase())
				return this.filterManuals(search).slice(0, 8)
			}
			return this.manuals.slice(0, 8)
		},
		...mapState({
			manuals: state => state.topics.manuals,
			loaded: state => state.topics.fetchedManuals
		})
	},
	methods: {
		filterManuals (search) {
			const manuals = this.manuals.filter((manual) => {
				return manual.low_manual.includes(search) || manual.low_subtopic.includes(search) || manual.low_subtopic.includes(search)
			})
			return manuals
		},
		removeAccents (cadena) {
			const acentos = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' }
			return cadena.split('').map(letra => acentos[letra] || letra).join('').toString()
		},
		closeSearchOptions () {
			setTimeout(() => {
				this.isSearchbarOpen = false
			}, 200)
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	#header-searchbar {
		position: relative;
		.searchbar-input {
			background: #F3F3F3;
			border: 1px solid #979797;
			border-radius: 5px;
			width: 867px;
			height: 40px;
			display: flex;
			align-items: center;
			padding: 0px 10px;
			position: relative;
			z-index: 9;
			input {
				height: 100%;
				flex-grow: 1;
				background: inherit;
				border: none;
				&:focus {
					outline: none;
				}
			}
			.search-icon {
				width: 17px;
				height: 17px;
			}
			&:hover {
				border: thin solid black;
			}
		}
		.searchbar-input + * {
			position: absolute;
			width: 100%;
			max-height: 50vh;
			overflow-x: hidden;
			overflow-y: auto;
			background: #ffffff;
			border-radius: 8px;
			box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.25);
			.result-list-item {
				height: 45px;
				color: #{$neutral-900};
				&:hover {
					background-color: #{$neutral-100};
				}
				&:not(a) {
					cursor: default;
				}
			}
		}
	}
</style>
