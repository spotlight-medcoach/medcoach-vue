<template>
	<div id="diagnostic-test-layout" class="body-content">
		<DiagnosticTestHeader />
		<div class="only-pc d-flex">
			<nuxt class="main-content" />
		</div>
		<div class="only-small-device mb-5">
			<p class="m-5 text-center">
				Para utilizar a la plataforma MedCoach es necesario ingresar desde un dispositivo de escritorio o laptop con resolución mínima de 900px
			</p>
		</div>
	</div>
</template>
<script>
import DiagnosticTestHeader from '@/components/diagnostic_test/DiagnosticTestHeader'
export default {
	components: {
		DiagnosticTestHeader
	},
	mounted () {
		if (!process.env.DEVELOP) {
			document.onkeyup = this.onKeyUp
			document.addEventListener('contextmenu', event => event.preventDefault())
		}
	},
	methods: {
		onKeyUp (e) {
			const keyCode = e.keyCode ? e.keyCode : e.which
			if (keyCode === 44) {
				e.preventDefault()
				this.stopPrntScr()
				return false
			}
		},
		stopPrntScr () {
			const inpFld = document.createElement('input')
			inpFld.setAttribute('value', '.')
			inpFld.setAttribute('width', '0')
			inpFld.style.height = '0px'
			inpFld.style.width = '0px'
			inpFld.style.border = '0px'
			document.body.appendChild(inpFld)
			inpFld.select()
			document.execCommand('copy')
			inpFld.remove(inpFld)
		}
	}
}
</script>
<style lang="scss">
	@import '@/assets/css/variables/_student_header_vars.scss';
	@import '@/assets/css/variables/_student_sidebar_vars.scss';
	@import '@/assets/css/variables/_student_main.scss';
	#diagnostic-test-layout {
		background: #F8F8F8;
	}
	.body-content {
		font-family: 'Avenir', sans-serif;
		font-size: 14px;
		> * {
			position: relative;
		}
		.main-content {
			flex-grow: 1;
			flex-basis: 1280px;
			background-color: #FBFDFE;
			overflow-y: auto;
			height: $student-main-content-height;
		}
	}
	.full-height-container {
		height: $student-main-content-height;
		overflow: hidden;
		> * {
			height: 100%;
		}
	}
	.modal-content {
		border: none;
		> * {
			border: none;
		}
	}
	.navigation-disabled {
		opacity: 0.4;
		cursor: default;
		pointer-events: none;
	}
</style>
