<template>
	<div class="flashcards-list-header">
		<div class="row">
			<!----- Botón de regresar------->
			<div
				class="col-sm  my-auto"
				@click="$emit('setCurrentComponent', back_component)"
			>
				<div class="d-flex align-items-center back-link">
					<ExpandIcon />
					<p>Regresar</p>
				</div>
			</div>
			<!----- Título ----------------->
			<div class="col-sm text-center  my-auto">
				<p class="manual-title">{{ manual_title }}</p>
			</div>
			<!----- Opciones de reproducción -->
			<div class="col-sm">
				<div
					v-if="!hide_reprod_options"
					class="d-flex justify-content-end align-items-center"
				>
					<span
						@click="$store.commit('flashcards/setRepeatActivated', !repeatActivated)"
						class="mr-15px option-icon"
						:class="{
							'option-icon-active': repeatActivated
						}"
					>
						<RepeatIcon/>
					</span>
					<span
						@click="$store.commit('flashcards/setRandomActivated', !randomActivated)"
						class="mr-15px option-icon"
						:class="{
							'option-icon-active': randomActivated
						}"
					>
						<ShuffleIcon />
					</span>
					<span
						class="mr-15px option-icon"
						@click="$emit('setCurrentComponent', 'flashcards_study')"
					>
						<PlayIcon />
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import ExpandIcon from '@/components/icons/ExpandIcon.vue'
import PlayIcon from '@/components/icons/PlayIcon.vue'
import RepeatIcon from '@/components/icons/RepeatIcon.vue'
import ShuffleIcon from '@/components/icons/ShuffleIcon.vue'

export default {
	props: {
		manual_title: {
			type: String,
			required: true
		},
		back_component: {
			type: String,
			required: true
		},
		hide_reprod_options: {
			type: Boolean,
			default: false
		}
	},
	components: {
		ExpandIcon,
		PlayIcon,
		RepeatIcon,
		ShuffleIcon
	},
	computed: {
		...mapGetters({
			randomActivated: 'flashcards/randomActivated',
			repeatActivated: 'flashcards/repeatActivated'
		})
	}
}
</script>
<style>
	.flashcards-list-header {
		background-color: white;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.239922);
		padding: 14px 34px;
	}
</style>
