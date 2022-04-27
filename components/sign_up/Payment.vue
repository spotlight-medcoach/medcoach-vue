<template>
	<div id="payment">
		<div class="mx-auto mt-auto">
			<img
				src="@/assets/images/logo.svg"
				class="logo d-block mx-auto mb-40px"
			>
			<div class="card login-card mb-20px">
                <div class="text-center mb-20px">
                    <p class="login-title">Suscripción</p>
                    <p class="login-subtitle">Realiza el pago de tu suscripción</p>
                </div>
                <template v-if="!selectedPlan">
                    <!-- BENEFITS LOADER -->
                    <section class="benefits-container d-flex flex-column align-items-center justify-content-center">
                        <article>
                            <loading-state />
                        </article>
                    </section>
                </template>
                <b-row v-else>
                    <b-col class="benefits-container d-flex flex-column align-items-center justify-content-center">
                        <article>
                            <dl class="body-md">
                                <dt class="my-2">2 exámenes diagnósticos *</dt>
                                <dt class="my-2">3 simuladores tipo ENARM</dt>
                                <dt class="my-2">Algoritmo BrainWave</dt>
                                <dt class="my-2">Flashcards + notas inteligentes</dt>
                                <dt class="my-2">+600 temas dirigidos al ENARM</dt>
                                <dt class="my-2">+3,500 preguntas formato ENARM</dt>
                            </dl>
                            <hr class="ml-0 mb-1">
                            <p class="heading-4">${{selectedPlan.amount}}</p>
                            <span class="body-md ml-4">mensuales</span>
                            <ul class="body-md mt-5">
                                <li class="my-3">Acceso a la plataforma el tiempo que quieras mientras te encuentres suscrito</li>
                                <li class="my-3">Puedes cancelar tu suscripción y volver cuando desees, tus notas y progreso se quedarán guardados</li>
                                <li class="my-3">El número de exámenes diagnóstico y fase a seleccionar varia acorde al tiempo de inicio de curso</li>
                            </ul>
                        </article>
                    </b-col>
                    <b-col class="payment-container d-flex flex-column align-items-center justify-content-center"><!-- Manual List column -->
                        <conekta-frame v-if="selectedPlan.id" :planId="selectedPlan.id" class="payment-form" />
                    </b-col>
                </b-row>
			</div>
		</div>
		<div class="mx-auto mt-auto mb-40px">
			<a style="color: #7D7A7A" href="#">AVISO DE PRIVACIDAD</a>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from '@/assets/utils/validations.js'
import LoadingState from '@/components/LoadingState.vue'
import ConektaFrame from '@/components/ConektaFrame.vue'
export default {
	layout: 'index',
    components: {
		LoadingState,
		ConektaFrame
	},
	data () {
		return {
			form: {
				verificationCode: ''
			},
			required,
			loginLoading: false,
			loaded: false
		}
	},
	mounted () {
		this.loaded = true
        console.log('Selected plan:', this.selectedPlan)
	},
	methods: {
		pay () {
			if (!this.loginLoading) {
				this.loginLoading = true
			}
		}
	},
    computed: {
		selectedPlan () {
			return this.subscriptionPlans.find(plan => plan.id === this.promotedPlan.id)
		},
        ...mapGetters({
            subscriptionPlans: 'sign_up/subscriptionPlans',
            promotedPlan: 'sign_up/promotedPlan'
        })
	}
}
</script>
<style lang="scss">
	#payment {
		height: 100vh;
		width: 100vw;
		display: flex;
		overflow-x: hidden;
		flex-direction: column;

		.logo {
			width: 238px;
		}

		.login-card {
			max-width: 1200px;
            width: auto;
		}

		.login-title {
			font-style: normal;
			font-weight: 750;
			font-size: 32px;
			line-height: 36px;
		}

		.login-subtitle {
			font-style: normal;
			font-weight: normal;
			font-size: 24px;
			line-height: 36px;
		}

        .benefits-container {
            border-right: 1px solid #8d8d8d;
            > article {
                max-width: 676px;
                hr {
                    max-width: 360px;
                    border-color: #000;
                }
                ul {
                    padding-left: 17px;
                }
            }
        }

        .payment-form {
            width: 540px;
        }

        .payment-container {
            padding: 0 !important;
        }
	}
</style>
