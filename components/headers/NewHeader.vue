<template>
	<header id="new-header">
		<div class="toggle-sidebar-container">
			<div
				class="cursor-pointer sidebar-icon"
				:class="sidebarActive ? 'is-sidebar-active' : 'is-sidebar-inactive'"
				@click="$store.commit('sidebar/setSidebarActive', !sidebarActive)"
			>
				<ExpandIcon />
			</div>
		</div>
		<div class="logo-container">
			<img src="@/assets/images/MedCOACH.png" class="logo">
			<!-- <img src="@/assets/images/logo.svg" class="logo"> -->
		</div>
		<Searchbar />
		<Profile />
	</header>
</template>
<script>
import { mapGetters } from 'vuex'
import ExpandIcon from '@/components/icons/ExpandIcon.vue'
import Searchbar from '@/components/headers/Searchbar.vue'
import Profile from '@/components/headers/Profile.vue'
export default {
	components: {
		Searchbar,
		Profile,
		ExpandIcon
	},
	computed: {
		...mapGetters({
			sidebarActive: 'sidebar/sidebarActive'
		})
	}
}
</script>
<style lang="scss">
	@import '@/assets/css/variables/_student_header_vars.scss';
	@import '@/assets/css/variables/_student_sidebar_vars.scss';
	#new-header {
		height: $student-header-height;
		width: 100%;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.239922);
		display: grid;
		grid-template-columns: $student-sidebar-width auto 1fr auto;
		gap: 1rem;
		align-items: center;
		justify-items: center;
		z-index: 9;
		padding-right: 55px;
		.toggle-sidebar-container {
			text-align: center;
			.sidebar-icon {
				transform: rotateY(0);
				transition: transform 0.3s ease;
				-moz-transition: transform 0.5s ease;
				> * {
					width: 24px;
					height: 24px;
				}
			}
			.sidebar-icon.is-sidebar-inactive {
				transform: rotateY(180deg);
			}
		}
		.logo-container {
			> * {
				width: 180px;
			}
		}
	}
</style>
