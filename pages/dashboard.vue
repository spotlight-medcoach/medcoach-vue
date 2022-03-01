<template>
	<div>
		<template v-if="isFreeTrial === true">
			<dashboard-trial />
		</template>
		<template v-else-if="isFreeTrial === false">
			<dashboard-index />
		</template>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import DashboardTrial from '@/components/dashboard/DashboardTrial.vue'
import DashboardIndex from '@/components/dashboard/DashboardIndex.vue'
export default {
	layout: 'new_default',
	components: {
		DashboardTrial,
		DashboardIndex
	},
	computed: {
		...mapState({
			isFreeTrial: 'isFreeTrial'
		})
	}
}
</script>
