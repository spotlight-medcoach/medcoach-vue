<template>
	<b-overlay :show="loading" rounded="sm">
		<div id="conektaIframeContainer" style="height: 590px;" />
	</b-overlay>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'ConektaFrame',
	props: {
		planId: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
			loading: true
		}
	},
	computed: {
		...mapState({
			student: state => state.studentInfo,
			checkoutId: state => state.payment.checkoutId
		})
	},
	async mounted () {
		if (this.checkoutId) {
			this.initializeFrame(this.checkoutId)
		} else {
			const checkoutId = await this.$store.dispatch('payment/createConektaNullToken')
			this.initializeFrame(checkoutId)
		}
	},
	methods: {
		async producePayment (token) {
			this.loading = true
			const data = await this.$store.dispatch('payment/registerSubscription', {
				student_id: this.student._id,
				plan_id: this.planId,
				token_id: token.id
			})
			if (data) {
				this.$router.push('congrats')
			}
			this.loading = false
		},
		initializeFrame (checkoutId) {
			window.ConektaCheckoutComponents.Card({
				targetIFrame: '#conektaIframeContainer',
				// Este componente 'allowTokenization' permite personalizar el tokenizador, por lo que su valor siempre será TRUE
				allowTokenization: true,
				checkoutRequestId: checkoutId, // // Checkout request ID, es el mismo ID generado en el paso 1
				publicKey: process.env.CONEKTA_PUBLIC_KEY, // Llaves: https://developers.conekta.com/docs/como-obtener-tus-api-keys
				options: {
					styles: {
					// inputType modifica el diseño del Web Checkout Tokenizer
					//        inputType: 'basic' // 'basic' | 'rounded' | 'line'
						inputType: 'basic',
						// buttonType modifica el diseño de los campos de llenado de información del  Web Checkout Tokenizer
						//        buttonType: 'basic' // 'basic' | 'rounded' | 'sharp'
						buttonType: 'basic',
						// Elemento que personaliza el borde de color de los elementos
						states: {
							empty: {
								borderColor: '#ff9300' // Código de color hexadecimal para campos vacíos
							},
							invalid: {
								borderColor: '#ff574f' // Código de color hexadecimal para campos inválidos
							},
							valid: {
								borderColor: '#74ed5c' // Código de color hexadecimal para campos llenos y válidos
							}
						}
					},
					languaje: 'es', // 'es' Español | 'en' Ingles
					// Elemento que personaliza el botón que finzaliza el guardado y tokenización de la tarjeta
					button: {
						colorText: '#ffffff', // Código de color hexadecimal para el color de las palabrás en el botón de: Alta de Tarjeta | Add Card
						// text: 'Agregar Tarjeta***', //Nombre de la acción en el botón ***Se puede personalizar
						backgroundColor: '#ff9300 !important' // Código de color hexadecimal para el color del botón de: Alta de Tarjeta | Add Card
					},
					// Elemento que personaliza el diseño del iframe
					iframe: {
						colorText: '#000000', // Código de color hexadecimal para el color de la letra de todos los campos a llenar
						backgroundColor: '#FFFFFF' // Código de color hexadecimal para el fondo del iframe, generalmente es blanco.
					}
				},
				// Evento que permitirá saber que el token se creao de forma satisfactoria, es importante que se consuman los datos que de él derivan.
				onCreateTokenSucceeded: (token) => {
					this.producePayment(token)
				},
				// Evento que permitirá saber que el token se creao de manera incorrecta, es importante que se consuman los datos que de él derivan y se hagan las correciones pertinentes.
				onCreateTokenError: (error) => {
					console.log(error)
				}
			})
			this.loading = false
		}
	}
}
</script>
<style scoped>
	.loading {
		opacity: 0.5;
	}
</style>
