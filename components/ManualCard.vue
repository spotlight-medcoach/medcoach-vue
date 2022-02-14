<template>
	<div
		v-if="review"
		class="manual review m-2 p-2"
		:class="{ 'manual-today': today, 'finished-review': manual.reviewed }"
		@click="goToReview(manual.manual_id)"
	>
		<div class="body-title-6 text-overflow mb-1"><b>{{ manual.manual_name }}</b></div>
		<div class="body-xsm">{{ manual.manual_subtopic_name }}</div>
		<!-- <div class="finished-icon" v-if="manual.reviewed">
			<img src="@/assets/icons/blue_check.svg" width="15" height="15">
		</div> -->
	</div>
	<div
		v-else
		class="manual normal m-2 p-2"
		:class="{ 'manual-today': today, 'finished': manual.finished}"
		@click="goToManual(manual.manual_id)"
	>
		<div class="body-title-6 text-overflow mb-1"><b>{{ manual.manual_name }}</b></div>
		<div class="body-xsm">{{ manual.manual_subtopic_name }}</div>
		<!-- <div class="finished-icon" v-if="manual.finished">
			<img src="@/assets/icons/orange_check.svg" width="15" height="15">
		</div> -->
	</div>
</template>
<script>
export default {
	props: {
		manual: {
			type: Object,
			required: true
		},
		today: {
			type: Boolean,
			default: false
		},
		review: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		goToManual (id) {
			if (!this.manual.finished) {
				if (this.$store.state.phase.id === 2) {
					this.$router.push({ path: '/review', query: { manual_id: id, review: false } })
				} else {
					this.$router.push({ path: '/manual', query: { manual_id: id } })
				}
			}
		},
		goToReview (id) {
			if (!this.manual.reviewed) {
				this.$router.push({ path: '/review', query: { manual_id: id, review: true } })
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	.manual {
		border-radius: 2px;
		opacity: 0.45;
	}
	.manual-today {
		opacity: 1;
	}
	.normal {
		cursor: pointer;
		background-color: #{$neutral-00};
		border: 1px solid #{$neutral-500};
		color: #000000;
		min-height: 64px;
	}
	.finished {
		background-color:  #{$main-400};
		border: 1px solid  #{$main-600};
		cursor: default;
	}
	.review {
		cursor: pointer;
		background-color: #{$accent_b-100};
		border: 1px solid #{$accent_b-300};
	}
	.finished-review {
		background-color: #{$accent_b-500};
		border: 1px solid #{$accent_b-700};
		cursor: default;
	}
	.finished-icon {
		position: absolute;
		bottom: 10px;
		right: 10px;
	}
</style>
