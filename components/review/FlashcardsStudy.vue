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
		<div id="flashcard-wrapper">
			<!-- Indicador de flashcard activa -->
			<div class="flashcard-indicator">
				<span>1</span>
				/
				<span>20</span>
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
				<b-tab title="Frente" active><p class="text-left">I'm the first tab</p></b-tab>
				<b-tab title="Detrás"><p>I'm the second tab</p></b-tab>
			</b-tabs>
			<!-- Icono de Edición ---------------->
			<span
				class="option-icon edit-icon"
				@click="$emit('setCurrentComponent', 'flashcard_form')"
			>
				<EditIcon />
			</span>
			<!-- Controles de las flashcards ----->
			<div class="d-flex align-items-center justify-content-between">
				<div class="d-flex align-items-center">
					<span class="option-icon mr-16px">
						<RepeatIcon
							:style="{
								height: '34.5px',
								width: '40.5px'
							}"
						/>
					</span>
					<span class="option-icon">
						<ShuffleIcon
							:style="{
								height: '28.5px',
								width: '40.5px'
							}"
						/>
					</span>
				</div>
				<div class="d-flex align-items-center">
					<span class="option-icon mr-50px">
						<PlayIcon
							:style="{
								height: '52px',
								width: '39px',
								transform: 'rotate(180deg)'
							}"
						/>
					</span>
					<span class="option-icon">
						<PlayIcon
							:style="{
								height: '52px',
								width: '39px'
							}"
						/>
					</span>
				</div>
				<div class="d-flex align-items-center">
					<span class="option-icon">
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
			tab_index: 0
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
			flashcards: 'flashcards/flashcards'
		})
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
