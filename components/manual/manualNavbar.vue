
<template>
	<div id="manual-navbar" class="w-100 d-inline-flex justify-content-between align-items-center">
		<!------------------------------------------------------------------------- LEFT CONTENT -->
		<b-skeleton-wrapper :loading="!(title)">
			<template #loading>
				<div>
					<b-skeleton animation="throb" width="300px" height="30px" class="ml-2"></b-skeleton>
				</div>
			</template>
			<div class="mx-3 header-md" v-if="(title)">
				{{ title }}
			</div>
		</b-skeleton-wrapper>
		<!------------------------------------------------------------------------- RIGHT CONTENT -->
		<div class="d-inline-flex align-items-center neutral-color-600">
			<!----------------------------------------------------------------- Cambiar brillo de vista -->
			<div class="mx-2 d-inline-flex align-items-center">
				<switch-brightness-button
					@onChangeBrightness="changeBrightness"
				>
				</switch-brightness-button>
			</div>
			<div class="v-divider" />
			<!----------------------------------------------------------------- Cambiar tamaño de letra -->
			<div class="mx-2 d-inline-flex align-items-center">
				<b-icon
					icon="dash"
					class="m-2 pointer"
					@click="changeFontSize(-1)"
				/>
				<strong class="change-font-size-button">
					<small>A</small>
					<span>A</span>
				</strong>
				<b-icon
					icon="plus"
					class="m-2 pointer"
					@click="changeFontSize(1)"
				/>
			</div>
			<div class="v-divider" />
			<!----------------------------------------------------------------- Marcar como aprendido -->
			<template v-if="allowFinishManual && phase.id !== 2">
				<div class="mx-2 d-inline-flex align-items-center">
					<holdable-button
						message="Manten presionado para marcar como aprendido"
						:maxWidth="200"
						@onCheck="finishManual"
					>
					</holdable-button>
				</div>
				<div class="v-divider" />
			</template>
			<!----------------------------------------------------------------- Reportar manual -->
			<div class="mx-2 d-inline-flex align-items-center main-color">
				<b-icon
					align-v="center"
					icon="exclamation-triangle"
					class="h3 m-0 mx-2"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import SwitchBrightnessButton from '@/components/_functional/switchBrightnessButton.vue'
import HoldableButton from '@/components/_functional/holdableButton.vue'
export default {
	components: {
		SwitchBrightnessButton,
		HoldableButton
	},
	props: {
		manual_id: {
			type: String,
			default: '5e214ebdb1131e0411f37e65'
		},
		allowFinishManual: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		title () {
			let name = ''
			this.topics.some((topic) => {
				return topic.subtopics.some((subtopic) => {
					return subtopic.manuals.some((manual) => {
						if (manual.id === this.manual_id) {
							name = manual.name
							return true
						}
						return false
					})
				})
			})
			return name
		},
		...mapState({
			phase: state => state.phase,
			topics: state => state.topics.data
		})
	},
	data () {
		return {
			fontSize: 1
		}
	},
	methods: {
		changeFontSize (change) {
			const scale = 0.1
			const fontSize = +parseFloat(change * scale + this.fontSize).toFixed(1)
			if (fontSize >= 1 && fontSize <= 1.4) {
				this.fontSize = fontSize
				this.$emit('onChangeFontSize', this.fontSize)
			}
		},
		changeBrightness (brightness) {
			this.$emit('onChangeBrightness', brightness)
		},
		finishManual () {
			this.$emit('onFinishManual')
		}
	}
}
</script>
<style lang="scss" scoped>
	@import '@/assets/css/variables/color-palette.scss';
	#manual-navbar {
		height: 60px;
		small {
			font-size: 0.7em;
		}
		.bi-dash,
		.bi-plus {
			font-size: 1.4em;
			line-height: 2em;
		}
		.v-divider {
			border-right: 1px solid #{$neutral-600};
			height: 17px;
		}
	}
</style>
