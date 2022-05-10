<template>
	<section id="custom-test-history" class="custom-card">
		<div id="custom-test-history-header">
			<p>Historial</p>
		</div>
		<div v-if="history">
			<div v-if="history.length === 0">
				<p>No ha ralizado exámenes</p>
			</div>
			<CustomTestHistoryItem
				v-for="(item, index) in history"
				:key="`history-${index}`"
				:item="item"
			/>
		</div>
		<div v-else class="d-flex flex-column">
			<div>
				<div class="d-flex justify-content-around" style="font-size: 20px;">
					Cargando...
				</div>
				<div class="d-flex justify-content-around mt-3">
					<img src="@/assets/icons/loading.svg" width="50" />
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomTestHistoryItem from '@/components/custom_test_config/CustomTestHistoryItem'

export default {
	components: {
		CustomTestHistoryItem
	},
	computed: {
		...mapGetters({
			history: 'custom_test/history'
		})
	}
}
</script>
<style lang="scss">
	#custom-test-history {
		min-width: 315px;
		padding: 0px 16px 20px 16px !important;
		overflow-y: auto;
		position: relative;
		height: 86vh;

		&-header {
			padding-bottom: 10px;
			padding-top: 20px;
			text-align: center;
			margin-bottom: 20px;
			border-bottom: 2px solid #000000;
			font-size: 24px;
			font-weight: 900;
			position: sticky;
			top: 0px;
			background: white;
			z-index: 2;
		}
	}
</style>
