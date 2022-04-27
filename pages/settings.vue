<template>
	<div id="settings" style="padding-top:50px">
		<div v-if="onHttpRequest" class="w-100">
			<loading-state :message="message" height="60vh" />
		</div>
		<div v-else-if="errorHttp">
			<p>{{ message }}</p>
		</div>
		<b-container v-else style="margin-bottom: 20px;">
			<b-row>
				<!-- //Perfil y usuario -->
				<b-col style="margin-bottom: 50px">
					<div align="left">
						<div class="d-flex justify-content-between mb-4">
							<p class="title">
								Perfil
							</p>
							<b-overlay
								:show="saving"
								rounded
								opacity="0.6"
								spinner-small
								spinner-variant="primary"
								class="d-inline-block"
							>
								<b-button variant="primary" @click="sendForm">
									{{ profileEnabled ? "Guardar Cambios" : "Editar Perfil" }}
								</b-button>
							</b-overlay>
						</div>
						<b-row class="my-3">
							<b-col>
								<label>Nombre</label>
								<b-form-input v-model="userInfo.first_name" class="inputForm input-valid" :state="null" placeholder="Nombre" :disabled="!profileEnabled" />
							</b-col>
							<b-col>
								<label>Apellido</label>
								<b-form-input v-model="userInfo.last_name" class="inputForm input-valid" :state="null" placeholder="Apellidos" :disabled="!profileEnabled" />
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<label>Dirección</label>
								<b-form-input v-model="userInfo.address" class="inputForm input-valid" :state="null" placeholder="Dirección" :disabled="!profileEnabled" />
							</b-col>
						</b-row>
						<b-row class="my-3">
							<b-col>
								<label>Correo electrónico</label>
								<b-form-input
									v-model="userInfo.email"
									type="email"
									class="inputForm input-valid"
									:state="null"
									placeholder="Email"
									:disabled="!profileEnabled"
								/>
							</b-col>
							<b-col>
								<label>País</label>
								<b-form-input v-model="userInfo.country" class="inputForm input-valid" :state="null" placeholder="País" :disabled="!profileEnabled" />
							</b-col>
						</b-row>
						<b-row class="my-3">
							<b-col>
								<label>Estado</label>
								<b-form-input v-model="userInfo.state" class="inputForm input-valid" :state="null" placeholder="Estado" :disabled="!profileEnabled" />
							</b-col>
							<b-col>
								<label>Teléfono</label>
								<b-form-input v-model="userInfo.phone" class="inputForm input-valid" :state="null" placeholder="Teléfono" :disabled="!profileEnabled" />
							</b-col>
						</b-row>
					</div>
					<div align="left" class="mt-5">
						<p class="title mb-4">
							Usuario
						</p>
						<div class="my-3">
							<label>Universidad</label>
							<v-select
								v-if="universitiesList.length === 0"
								key="universities"
								disabled
								placeholder="Loading..."
							/>
							<v-select
								v-else
								v-model="userInfo.university"
								:options="universitiesList"
								:reduce="user=>user._id"
								label="name"
								:disabled="!profileEnabled"/>
						</div>
						<div class="my-3">
							<label>Especialidades</label>
							<v-select
								v-if="specialitiesList.length === 0"
								key="specialities"
								disabled
								placeholder="Loading..."
							/>
							<v-select
								v-else
								v-model="userInfo.speciality"
								:options="specialitiesList"
								:reduce="user=>user._id"
								label="name"
								:disabled="!profileEnabled"/>
						</div>
					</div>
					<div align="left" class="mt-5" v-if="userInfo.card !== null">
						<p class="title mb-4">
							Estudio
						</p>
						<div class="my-3">
							<label class="lblInfo">Fecha de examen</label>
							<b-form-datepicker id="dateExam" v-model="userInfo.test_date" class="mb-2" :disabled="true" />
						</div>
						<div class="my-3">
							<label class="lblInfo">Dia de descanso</label>
							<b-form-select v-model="userInfo.free_day" :disabled="!profileEnabled">
								<option v-for="option in dayOptions" :key="option.value" :value="option.value">
									{{ option.label }}
								</option>
							</b-form-select>
						</div>
					</div>
				</b-col>

				<!-- // Formulario de pago -->
				<b-col v-if="userInfo.plan_id !== undefined">
					<div align="left" v-if="userInfo.card !== null">
						<div class="d-flex justify-content-between mb-4">
							<p class="title">
								Pago y tarjeta
							</p>
							<b-button :variant="cardEnabled ? 'danger' : 'primary'" @click="loadConektaForm">
								{{ cardEnabled ? "Cancelar" : "Editar tarjeta" }}
							</b-button>
						</div>
						<b-row class="my-3" v-if="cardEnabled">
							<conekta-frame
								:planId="1"
								class="w-100"
								:type="updateCard"
								@onUpdateCard="updateCard"
							/>
						</b-row>
						<div v-else>
							<b-row class="my-3">
								<b-col>
									<label>Nombre en la tarjeta</label>
									<b-form-input v-model="userInfo.card.name" class="inputForm input-valid" :state="null" placeholder="Nombre en la tarjeta" disabled />
								</b-col>
							</b-row>
							<b-row class="my-3">
								<b-col>
									<label>Número en la tarjeta</label>
									<b-input-group>
										<template #prepend>
											<b-icon icon="credit-card-fill" font-scale="1.5"  />
										</template>
										<b-form-input v-model="cardNumber" class="inputForm input-valid" :state="null" placeholder="Número en la tarjeta" disabled></b-form-input>
									</b-input-group>
								</b-col>
							</b-row>
							<b-row class="my-3">
								<b-col>
									<label>Fecha de expiración</label>
									<b-form-input v-model="cardExpiration" class="inputForm input-valid" :state="null" placeholder="00/00" disabled />
								</b-col>
								<b-col>
									<label>CVV</label>
									<b-input-group>
										<template #prepend>
											<b-icon icon="lock-fill" font-scale="1.5" />
										</template>
										<b-form-input v-model="cvv" class="inputForm input-valid" :state="null" placeholder="***" disabled />
									</b-input-group>
								</b-col>
							</b-row>
						</div>
					</div>
					<div align="left" v-if="userInfo.card !== null">
						<div class="d-flex justify-content-between mt-5 mb-4">
							<p class="title">
								Suscripción
							</p>
						</div>
						<b-row class="my-3">
							<b-col>
								<b-alert v-if="userInfo.active_subscription" variant="success" show>
									<h4>Cuenta activa</h4>
									<p>${{ userInfo.subscription !== null  ? parseFloat(userInfo.subscription.amount / 100).toFixed(2) : '0.00' }}</p>
								</b-alert>
								<b-alert v-else variant="danger" show>
									<h4>Cuenta desactivada</h4>
									<p></p>
								</b-alert>
							</b-col>
						</b-row>
						<b-row class="my-3">
							<b-col>
								<b-button v-if="userInfo.active_subscription" variant="danger" class="mr-3" @click="deactiveSubscription">
									Desactivar cuenta
								</b-button>
								<b-button v-else variant="success" class="mr-3" @click="activateSubscription">
									Reactivar cuenta
								</b-button>
								<b-button variant="outline-light" @click="sendForm">
									Borrar cuenta
								</b-button>
							</b-col>
						</b-row>
						<b-row class="mb-3 mt-4">
							<b-col>
								<label>Fecha de próximo cobro</label>
								<h4>{{ userInfo.card.next_date_plan }}</h4>
							</b-col>
						</b-row>
						<b-row class="my-3">
							<b-col>
								<label>Cobro anterior</label>
								<h4>{{ userInfo.card.current_date_plan }}</h4>
							</b-col>
						</b-row>
					</div>
				</b-col>
				<b-col v-else>
					<div align="left" class="mt-5">
						<p class="title mb-4">
							Estudio
						</p>
						<div class="my-3">
							<label class="lblInfo">Fecha de examen</label>
							<b-form-datepicker id="dateExam" v-model="userInfo.test_date" class="mb-2" :disabled="true" />
						</div>
						<div class="my-3">
							<label class="lblInfo">Dia de descanso</label>
							<b-form-select v-model="userInfo.free_day" :disabled="!profileEnabled">
								<option v-for="option in dayOptions" :key="option.value" :value="option.value">
									{{ option.label }}
								</option>
							</b-form-select>
						</div>
					</div>
				</b-col>
			</b-row>
		</b-container>
		<cancel-subscription-modal
			@onCancelSubscription="cancelSubscription"
		/>
		<resume-subscription-modal
			@onResumeSubscription="resumeSubscription"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import LoadingState from '@/components/LoadingState.vue'
import CancelSubscriptionModal from '@/components/_functional/cancelSubscriptionModal.vue'
import ResumeSubscriptionModal from '@/components/_functional/resumeSubscriptionModal.vue'
import ConektaFrame from '@/components/ConektaFrame.vue'

export default {
	name: 'Configuracion',
	layout: 'new_default',
	components: {
		vSelect,
		LoadingState,
		CancelSubscriptionModal,
		ResumeSubscriptionModal,
		ConektaFrame
	},
	data () {
		return {
			saving: false,
			profileEnabled: false,
			cardEnabled: false,
			cardNumber: '•••• •••• •••• ••••',
			cardExpiration: '00/00',
			cvv: '***',
			userInfo: {
				first_name: '',
				last_name: '',
				address: '',
				email: '',
				country: '',
				state: '',
				phone: '',
				university: null,
				test_date: null,
				free_day: -1,
				speciality: null
			},
			reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
			universitiesList: [],
			specialitiesList: [],
			dayOptions: [
				{
					label: 'Ninguno',
					value: -1
				},
				{
					label: 'Lunes',
					value: 0
				},
				{
					label: 'Martes',
					value: 1
				},
				{
					label: 'Miercoles',
					value: 2
				},
				{
					label: 'Jueves',
					value: 3
				},
				{
					label: 'Viernes',
					value: 4
				},
				{
					label: 'Sabado',
					value: 5
				},
				{
					label: 'Domingo',
					value: 6
				}
			]
		}
	},
	watch: {
		studentInfo (newVal) {
			if (newVal) {
				this.userInfo = JSON.parse(JSON.stringify(newVal))
				this.cardNumber = `•••• •••• •••• ${this.userInfo.card ? this.userInfo.card.last4 : '••••'}`
				this.cardExpiration = `${this.userInfo.card ? this.userInfo.card.exp_month : ''}/${this.userInfo.card ? this.userInfo.card.exp_year : ''}`
			}
		}
	},
	computed: {
		...mapState({
			studentInfo: state => state.studentInfo,
			onHttpRequest: state => state.http_request.onHttpRequest,
			message: state => state.http_request.message,
			errorHttp: state => state.http_request.errorHttp
		})
	},
	created () {
		this.getUniversitiesData()
		this.getSpecialitiesData()
		if (this.studentInfo) {
			this.userInfo = JSON.parse(JSON.stringify(this.studentInfo))
			this.cardNumber = `•••• •••• •••• ${this.userInfo.card ? this.userInfo.card.last4 : '••••'}`
			this.cardExpiration = `${this.userInfo.card ? this.userInfo.card.exp_month : ''}/${this.userInfo.card ? this.userInfo.card.exp_year : ''}`
		}
	},
	mounted () {
		window.toastr.options = {
			positionClass: 'toast-bottom-right'
		}
	},
	methods: {
		getUniversitiesData () {
			this.$axios
				.get('/universities').then((res) => {
					const getList = res.data.universities
					getList.forEach((element) => {
						this.universitiesList.push(element)
					})
				}).catch((err) => {
					console.log(err)
				})
		},
		getSpecialitiesData () {
			this.$axios
				.get('/specialities').then((res) => {
					const getList = res.data.specialities
					getList.forEach((element) => {
						this.specialitiesList.push(element)
					})
				})
				.catch((err) => {
					console.log(err)
				})
		},
		saveDataLS () {
			if (process.client) {
				localStorage.setItem('studentData', JSON.stringify(this.userInfo))
			}
		},
		saveDataBD () {
			let token = ''
			if (process.client) {
				token = localStorage.getItem('usertoken')
			}

			const data = {
				first_name: this.userInfo.first_name,
				last_name: this.userInfo.last_name,
				country: this.userInfo.country,
				university: this.userInfo.university,
				free_day: this.userInfo.free_day,
				phone: this.userInfo.phone,
				state: this.userInfo.state,
				address: this.userInfo.address,
				test_date: this.userInfo.test_date,
				email: this.userInfo.email,
				speciality: this.userInfo.speciality
			}
			console.log('Data:', data)
			this.saving = true
			this.$axios
				.put('/students/info', data, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				})
				.then((res) => {
					console.log(res.data)
					this.$toastr.success('Información guardada correctamente', '¡Éxito!')
					this.$store.commit('setStudentInfo', this.userInfo)
				})
				.catch((err) => {
					console.log(err)
					this.$toastr.error('Error al guardar la información', 'Error')
				})
				.finally(() => {
					this.saving = false
					this.profileEnabled = false
				})
		},

		sendForm () {
			if (!this.profileEnabled) {
				this.profileEnabled = true
			} else {
				return (this.userInfo.email === '') ? console.log('') : (this.reg.test(this.userInfo.email)) ? (this.saveDataLS(), this.saveDataBD()) : console.log('El email es invalido')
			}
		},

		loadConektaForm () {
			this.cardEnabled = !this.cardEnabled
		},

		deactiveSubscription () {
			this.$bvModal.show('cancel-subscription-modal')
		},

		activateSubscription () {
			this.$bvModal.show('resume-subscription-modal')
		},

		cancelSubscription () {
			let token = ''
			if (process.client) {
				token = localStorage.getItem('usertoken')
			}
			this.$axios
				.delete('/students/subscription', {}, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				})
				.then((res) => {
					console.log(res.data)
					this.$toastr.success('Suscripción cancelada', '¡Éxito!')
					this.userInfo.active_subscription = false
					this.$store.commit('setStudentInfo', this.userInfo)
					this.$store.commit('setActiveSubscription', this.userInfo)
					if (process.client) {
						localStorage.setItem('active_subscription', this.userInfo.active_subscription)
					}
				})
				.catch((err) => {
					this.userInfo.active_subscription = true
					console.log(err)
					this.$toastr.error('Error al cancelar la suscripción', 'Error')
				})
				.finally(() => {
					this.saving = false
					this.profileEnabled = false
					this.$bvModal.hide('cancel-subscription-modal')
				})
		},

		resumeSubscription () {
			let token = ''
			if (process.client) {
				token = localStorage.getItem('usertoken')
			}
			this.$axios
				.put('/students/subscription', {}, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				})
				.then((res) => {
					console.log(res.data)
					this.$toastr.success('Suscripción reanudada', '¡Éxito!')
					this.userInfo.active_subscription = true
					this.$store.commit('setStudentInfo', this.userInfo)
					this.$store.commit('setActiveSubscription', this.userInfo)
					if (process.client) {
						localStorage.setItem('active_subscription', this.userInfo.active_subscription)
					}
				})
				.catch((err) => {
					this.userInfo.active_subscription = true
					console.log(err)
					this.$toastr.error('Error al reanudar la suscripción', 'Error')
				})
				.finally(() => {
					this.saving = false
					this.profileEnabled = false
					this.$bvModal.hide('resume-subscription-modal')
				})
		},
		updateCard (card) {
			this.userInfo.card.bin = card.bin
			this.userInfo.card.brand = card.brand
			this.userInfo.card.card_type = card.card_type
			this.userInfo.card.created_at = card.created_at
			this.userInfo.card.default = card.default
			this.userInfo.card.exp_month = card.exp_month
			this.userInfo.card.exp_year = card.exp_year
			this.userInfo.card.id = card.id
			this.userInfo.card.last4 = card.last4
			this.userInfo.card.name = card.name
			this.userInfo.card.object = card.object
			this.userInfo.card.parent_id = card.parent_id
			this.userInfo.card.type = card.type
			this.userInfo.card.visible_on_checkout = card.visible_on_checkout
			this.$store.commit('setStudentInfo', this.userInfo)
			this.cardEnabled = false
			this.$toastr.success('Tarjeta actualizada', '¡Éxito!')
		}
	}
}
</script>
