<template>
	<section id="flashcards-list">
		<!---------------------- Encabezado -->
		<FlashcardsListHeader
			:manual_title="manual_title"
			back_component="note_review"
			@setCurrentComponent="$emit('setCurrentComponent', $event)"
			class="mb-32px"
		/>
		<!------------ Listado de Flashcards -->
		<div id="flashcards-list-content">
			<div class="row">
				<div
					v-for="(flashcard, index) in flashcards"
					:key="`flashcard-${index}`"
					class="col-2 mb-32px"
				>
					<div class="d-flex justify-content-center">
						<FlashcardsListElement
							:flashcard="flashcard"
						/>
					</div>
				</div>
			</div>
			<span
				class="add-flashcard-icon option-icon"
				@click="$emit('setCurrentComponent', 'flashcard_form')"
			>
				<AddIcon />
			</span>
		</div>
	</section>
</template>
<script>
import { mapGetters } from 'vuex'
import FlashcardsListElement from '@/components/review/flashcards_list/FlashcardsListElement'
import FlashcardsListHeader from '@/components/review/flashcards_list/FlashcardsListHeader'
import AddIcon from '@/components/icons/AddIcon'

export default {
	props: {
		manual_title: {
			type: String,
			required: true
		}
	},
	components: {
		FlashcardsListElement,
		FlashcardsListHeader,
		AddIcon
	},
	computed: {
		...mapGetters({
			flashcards: 'flashcards/flashcards'
		})
	}
}
</script>
<style lang="scss">
	#flashcards-list {
		padding: 30px 0px;

		&-content  {
			position: relative;

			.add-flashcard-icon {
				position: absolute;
				right: -50px;
				top: 0px;

				svg {
					width: 36px;
				}
			}
		}
	}
</style>
