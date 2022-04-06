<template>
	<header id="diagnostic-header">
		<div class="logo-container">
			<img src="@/assets/images/MedCOACH.png" class="logo">
		</div>
		<div>
			<Profile />
		</div>
	</header>
</template>
<script>
import { mapGetters } from 'vuex'
import Profile from '@/components/headers/Profile.vue'
export default {
	components: {
		Profile
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
	#diagnostic-header {
		height: $student-header-height;
		width: 100%;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.239922);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 55px;
		padding-left: 87px;
		z-index: 9;
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
			.sidebar-icon.sidebar-inactive {
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
