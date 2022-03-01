<template>
	<nav
		id="student-sidebar"
		:class="{
			'sidebar-active': sidebarActive
		}"
	>
		<!-- Dashboard -->
		<div class="text-center nav-item-tooltip">
			<nuxt-link to="/dashboard">
				<HomeIcon class="nav-icon" />
			</nuxt-link>
			<span class="nav-item-tooltip-text">Dashboard</span>
		</div>

		<!-- Calendario -->
		<div class="text-center nav-item-tooltip" :class="{'disabled': isFreeTrial }">
			<nuxt-link to="/calendar">
				<CalendarIcon class="nav-icon" />
			</nuxt-link>
			<span class="nav-item-tooltip-text">Calendario</span>
		</div>

		<!-- Manuales -->
		<div class="text-center nav-item-tooltip">
			<nuxt-link to="/manuals">
				<ManualsIcon class="nav-icon" />
			</nuxt-link>
			<span class="nav-item-tooltip-text">Manuales</span>
		</div>

		<!-- Notas -->
		<div class="text-center nav-item-tooltip" :class="{'disabled': isFreeTrial }">
			<nuxt-link to="/notes">
				<NotesIcon class="nav-icon" />
			</nuxt-link>
			<span class="nav-item-tooltip-text">Notas</span>
		</div>

		<!-- Exámenes -->
		<div class="text-center nav-item-tooltip" :class="{'disabled': isFreeTrial }">
			<nuxt-link to="/custom_test_config">
				<TestsIcon class="nav-icon" />
			</nuxt-link>
			<span class="nav-item-tooltip-text">Exámenes</span>
		</div>

		<!-- Infográficos -->
		<div class="text-center nav-item-tooltip" :class="{'disabled': isFreeTrial }">
			<nuxt-link to="/infographics">
				<InfographicsIcon class="nav-icon" />
			</nuxt-link>
			<span class="nav-item-tooltip-text">Spotlights</span>
		</div>

		<!-- Análisis -->
		<div class="text-center nav-item-tooltip" :class="{'disabled': isFreeTrial }">
			<nuxt-link to="/">
				<InsightsIcon class="nav-icon" />
			</nuxt-link>
			<span class="nav-item-tooltip-text">Análisis</span>
		</div>
	</nav>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import CalendarIcon from '@/components/icons/CalendarIcon.vue'
import ManualsIcon from '@/components/icons/ManualsIcon.vue'
import NotesIcon from '@/components/icons/NotesIcon.vue'
import InsightsIcon from '@/components/icons/InsightsIcon.vue'
import InfographicsIcon from '@/components/icons/InfographicsIcon.vue'
import TestsIcon from '@/components/icons/TestsIcon.vue'
export default {
	components: {
		HomeIcon,
		CalendarIcon,
		ManualsIcon,
		NotesIcon,
		InsightsIcon,
		InfographicsIcon,
		TestsIcon
	},
	computed: {
		...mapState(({
			isFreeTrial: state => state.isFreeTrial
		})),
		...mapGetters({
			sidebarActive: 'sidebar/sidebarActive',
			sidebarEnabled: 'sidebar/sidebarEnabled'
		})
	}
}
</script>
<style lang="scss">
	@import '@/assets/css/variables/_student_header_vars.scss';
	@import '@/assets/css/variables/_student_sidebar_vars.scss';
	#student-sidebar {
		position: relative;
		height: calc(100vh - #{$student-header-height});
		min-width: #{$student-sidebar-width};
		flex-basis: #{$student-sidebar-width};
		margin-left: -#{$student-sidebar-width};
		padding-top: 30px;
		border-right: 1px solid #E8E8E1;
		background-color: #FFFFFF;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.239922);
		transition: margin-left 0.3s ease;
		-moz-transition: margin-left 0.5s ease;
		.disabled {
			opacity: 0.5;
			pointer-events: none;
		}
	}
	.sidebar-active {
		margin-left: 0 !important;
	}
	.nav-item-tooltip {
		height: 40px;
	}
	.nav-icon {
		height: 26px;
		width: 26px;
	}
</style>
