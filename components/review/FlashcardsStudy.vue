<template>
	<section id="flashcards-study">
		<!---------------------- Encabezado -->
		<FlashcardsListHeader
			:manual_title="manual_title"
			back_component="flashcards_list"
			hide_reprod_options
			@setCurrentComponent="$emit('setCurrentComponent', $event)"
			class="mb-32px"
		/>

		<!---------- Envoltura de la flashcard -->
		<div id="flashcard-wrapper" v-if="flashcard">
			<!-- Indicador de flashcard activa -->
			<div class="flashcard-indicator">
				<span>{{ flashcard_index + 1 }}</span>
				/
				<span>{{ flashcards.length }}</span>
			</div>
			<b-tabs
				v-model="tab_index"
				:content-class="{
					'custom-tab-content': true,
					'custom-tab-content-last-item-active': tab_index == 1
				}"
				align="right"
				nav-class="custom-nav-class"
				nav-class-wrapper="custom-nav-class-wrapper"
				class="mb-32px"
			>
				<b-tab title="Frente" active>
					<div class="text-center" v-html="flashcard.body_note"></div>
				</b-tab>
				<b-tab title="Detrás">
					<div v-html="flashcard.body_user"></div>
				</b-tab>
			</b-tabs>
			<!-- Icono de Edición ---------------->
			<span
				class="option-icon edit-icon"
				@click="goToForm"
			>
				<EditIcon />
			</span>
			<!-- Controles de las flashcards ----->
			<div class="d-flex align-items-center justify-content-between">
				<div class="d-flex align-items-center">
					<span
						@click="$store.commit('flashcards/setRepeatActivated', !repeatActivated)"
						class="option-icon mr-16px"
						:class="{
							'option-icon-active': repeatActivated
						}"
					>
						<RepeatIcon
							:style="{
								height: '34.5px',
								width: '40.5px'
							}"
						/>
					</span>
					<span
						@click="$store.commit('flashcards/setRandomActivated', !randomActivated)"
						class="option-icon"
						:class="{
							'option-icon-active': randomActivated
						}"
					>
						<ShuffleIcon
							:style="{
								height: '28.5px',
								width: '40.5px'
							}"
						/>
					</span>
				</div>
				<div class="d-flex align-items-center">
					<span
						class="option-icon mr-50px"
						@click="prevFlashcard"
						:class="{
							'disabled': !prevBtnActive
						}"
					>
						<PlayIcon
							:style="{
								height: '52px',
								width: '39px',
								transform: 'rotate(180deg)'
							}"
						/>
					</span>
					<span
						class="option-icon"
						@click="nextFlashcard"
						:class="{
							'disabled': !nextBtnActive
						}"
					>
						<PlayIcon
							:style="{
								height: '52px',
								width: '39px'
							}"
						/>
					</span>
				</div>
				<div class="d-flex align-items-center">
					<span
						@click="deleteFlashcard"
						class="option-icon"
					>
						<TrashIcon
							:style="{
								height: '30px'
							}"
						/>
					</span>
				</div>
			</div>

			<!----- Menú de acciones extra --->
			<div class="flashcards-study-menu">
				<ul class="flashcards-study-menu-list">
					<li>
						<nuxt-link
							class="pointer text-decoration-none"
							target="_blank"
							:to="`/manual?manual_id=${manual_id}`"
						>
							<ManualsIcon />
						</nuxt-link>
					</li>
					<li @click="$emit('setCurrentComponent', 'note_review')">
						<NotesIcon />
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>
<script>
import { mapGetters } from 'vuex'
import FlashcardsListHeader from '@/components/review/flashcards_list/FlashcardsListHeader'
import PlayIcon from '@/components/icons/PlayIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import RepeatIcon from '@/components/icons/RepeatIcon'
import ShuffleIcon from '@/components/icons/ShuffleIcon'
import ManualsIcon from '@/components/icons/ManualsIcon'
import NotesIcon from '@/components/icons/NotesIcon'

export default {
	props: {
		manual_title: {
			type: String,
			required: true
		},
		manual_id: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			tab_index: 0,
			flashcard_index: 0
		}
	},
	components: {
		FlashcardsListHeader,
		PlayIcon,
		EditIcon,
		TrashIcon,
		RepeatIcon,
		ShuffleIcon,
		ManualsIcon,
		NotesIcon
	},
	computed: {
		...mapGetters({
			flashcards: 'flashcards/flashcards',
			randomActivated: 'flashcards/randomActivated',
			repeatActivated: 'flashcards/repeatActivated'
		}),
		flashcard () {
			return this.flashcards[this.flashcard_index]
		},
		prevBtnActive () {
			return this.repeatActivated || this.flashcard_index > 0
		},
		nextBtnActive () {
			return this.repeatActivated || this.flashcard_index < (this.flashcards.length - 1)
		}
	},
	watch: {
		'flashcards' () {
			this.flashcard_index = 0
		}
	},
	methods: {
		prevFlashcard () {
			if (this.prevBtnActive) {
				this.flashcard_index = (this.repeatActivated && this.flashcard_index === 0) ? this.flashcards.length - 1 : this.flashcard_index - 1
			}
		},
		nextFlashcard () {
			if (this.nextBtnActive) {
				this.flashcard_index = (this.repeatActivated && this.flashcard_index === (this.flashcards.length - 1)) ? 0 : this.flashcard_index + 1
			}
		},
		goToForm () {
			this.$store.commit('flashcards/setFlashcardId', this.flashcard._id)
			this.$emit('setCurrentComponent', 'flashcard_form')
		},
		deleteFlashcard () {
			this.$store.commit('flashcards/setFlashcardId', this.flashcard._id)
			this.$bvModal.show('confirm-delete-flashcard-modal')
		}
	}
}
</script>
<style lang="scss">
	#flashcards-study {
		padding-top: 30px;
		padding-bottom: 20px;

		#flashcard-wrapper {
			width: 949px;
			margin: 0px auto;
			position: relative;

			.custom-tab-content {
				border: 1px solid #979797;
				box-sizing: border-box;
				border-radius: 14px;
				padding: 20px 50px 20px 10px;
				height: 377px;
				background-color: white;

				&-last-item-active {
					border-radius: 14px 0px 14px 14px !important;
				}
			}
			.custom-nav-class {
				border-bottom: none;

				.nav-link {
					border-top-left-radius: 14px !important;
					border-top-right-radius: 14px !important;
					padding: 6px 1rem !important;
					border-color: #979797 #979797 #fff !important;
					opacity: 0.3;
					font-size: 16px;
				}

				.nav-link.active {
					opacity: 1;
				}
			}
			.edit-icon {
				position: absolute;
				top: 60px;
				right: 20px;

				svg {
					height: 30px;
					width: 24px;
				}
			}
			.flashcards-study-menu {
				background: #FFFFFF;
				box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.239922);
				width: 74px;
				padding: 24px 0px;
				position: absolute;
				right: -130px;
				top: 150px;

				.flashcards-study-menu-list {
					list-style: none;
					list-style-type: none;
					margin: 0;
					padding: 0;
					text-align: center;

					li {
						cursor: pointer;
						& + li{
							margin-top: 32px;
						}
					}
				}
			}
			.flashcard-indicator {
				position: absolute;
				top: 0px;
				left: 50%;
				font-size: 20px;
			}
		}
	}
</style>
