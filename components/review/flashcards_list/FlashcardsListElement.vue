<template>
	<div class="flashcards-list-element">
		<p v-html="flashcard.body_note"></p>
		<!-- Parte de Edición -->
		<div class="flashcards-list-element-edition">
			<span
				class="option-icon mr-27px"
				@click="editFlashcard"
			>
				<EditIcon
					:style="{
						height: '30px'
					}"
				/>
			</span>
			<span
				class="option-icon"
				@click="deleteFlashCard"
			>
				<TrashIcon
					:style="{
						height: '25px'
					}"
				/>
			</span>
		</div>
	</div>
</template>
<script>
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'

export default {
	props: {
		flashcard: {
			type: Object,
			required: true
		}
	},
	components: {
		EditIcon,
		TrashIcon
	},
	methods: {
		deleteFlashCard () {
			this.$store.commit('flashcards/setFlashcardId', this.flashcard._id)
			this.$bvModal.show('confirm-delete-flashcard-modal')
		},
		editFlashcard () {
			this.$store.commit('flashcards/setFlashcardId', this.flashcard._id)
			this.$emit('setCurrentComponent', 'flashcard_form')
		}
	}
}
</script>
<style lang="scss">
	.flashcards-list-element {
		width: 150px;
		height: 218px;
		background: #FFFFFF;
		border: 1px solid #858383;
		box-sizing: border-box;
		border-radius: 14px;
		padding: 9px 10px 7px 8px;
		text-align: center;
		position: relative;
		overflow: hidden;

		&-edition {
			position: absolute;
			bottom: 0px;
			left: 0px;
			width: 100%;
			display: flex;
			align-items: end;
			justify-content: center;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0) -28.49%, #FFFFFF 50%);
			border-radius: 0px 0px 14px 14px;
			height: 86px;
			padding-bottom: 16px;
		}
	}
</style>
