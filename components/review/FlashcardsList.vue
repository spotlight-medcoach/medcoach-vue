<template>
	<section id="flashcards-list">
		<!------------ Encabezado -->
		<div class="flashcards-list-header">
			<div class="row">
				<!----- Botón de regresar------->
				<div
					class="col-sm  my-auto"
					@click="$emit('setCurrentComponent', 'note_review')"
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
				<!----- Marcar como aprendido -->
				<div class="col-sm">
					<div class="d-flex justify-content-end">
						<RepeatIcon />
						<ShuffleIcon />
						<PlayIcon />
					</div>
				</div>
			</div>
		</div>
		<!------------ Listado de Flashcards -->
		<div class="flashcards-list-content">
			<div class="row">
			</div>
		</div>
	</section>
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
			flashcards: 'flashcards/flashcards'
		})
	}
}
</script>
<style lang="scss">
	#flashcards-list {
		.flashcards-list-header {
			box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.239922);
			padding: 14px 34px;
			margin-bottom: 38px;
		}
	}
</style>
