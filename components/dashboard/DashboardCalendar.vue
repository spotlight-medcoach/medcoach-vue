<template>
	<div align="left">
		<h3 class="body-title-1">
			{{ currentDate }}
		</h3>
		<div class="d-grid">
			<div v-for="day in week" :key="day.number" class="px-0">
				<div
					class="day-header body-md my-4"
					align="center"
					:class="[day.index == 0 ? 'today' : '']">
					<p class="my-2">{{ day.day }}</p>
					<p class="my-2">{{ day.number }}</p>
				</div>
				<manual-card
					v-for="(item,index) in day.data"
					:key="index"
					:manual="item"
					:today="day.index == 0"
				/>
				<!-- <hr v-if="day.reviewed && day.reviewed.length" style="border-color: black;"> -->
				<manual-card
					v-for="(item,index) in day.reviewed"
					:key="'reviewed' + index"
					:manual="item"
					:today="day.index == 0"
					:review="true"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { getRandomNumberBetween } from '@/helpers/skeleton'
import ManualCard from '@/components/ManualCard'
export default {
	name: 'DashboardCalendar',
	components: {
		ManualCard
	},
	data () {
		moment.locale('es')
		return {
			currentDate: this.capitalizeFirstLetter(moment().format('MMMM YYYY')),
			week: [
				{
					day: 'Lunes',
					number: null,
					index: null,
					data: [],
					reviewed: []
				},
				{
					day: 'Martes',
					number: null,
					index: null,
					data: [],
					reviewed: []
				},
				{
					day: 'Miércoles',
					number: null,
					index: null,
					data: [],
					reviewed: []
				},
				{
					day: 'Jueves',
					number: null,
					index: null,
					data: [],
					reviewed: []
				},
				{
					day: 'Viernes',
					number: null,
					index: null,
					data: [],
					reviewed: []
				},
				{
					day: 'Sábado',
					number: null,
					index: null,
					data: [],
					reviewed: []
				},
				{
					day: 'Domingo',
					number: null,
					index: null,
					data: [],
					reviewed: []
				}
			]
		}
	},
	computed: {
		...mapState({
			syllabus: 'syllabus',
			isFreeTrial: 'isFreeTrial',
			manuals: state => state.topics.manuals
		})
	},
	mounted () {
		this.fillCalendar()
	},
	methods: {
		capitalizeFirstLetter (string) {
			return string.charAt(0).toUpperCase() + string.slice(1)
		},
		randomManuals (quantity) {
			const manualIdx = getRandomNumberBetween(0, this.manuals.length - 1)
			return this.manuals.slice(manualIdx, manualIdx + quantity)
		},
		fillCalendar () {
			const today = moment()
			let dayOfWeek = moment().day()
			dayOfWeek -= 1
			if (dayOfWeek < 0) {
				dayOfWeek = 6
			}
			const minIndex = 0 - dayOfWeek
			const maxIndex = minIndex + 6
			const days = []
			for (let i = minIndex; i < 0; i++) {
				days.push(moment(today).subtract(Math.abs(i), 'days').format('D'))
			}
			days.push(today.format('D'))
			for (let i = 1; i <= maxIndex; i++) {
				days.push(moment(today).add(i, 'days').format('D'))
			}
			if (!this.isFreeTrial) {
				this.week.forEach((element, index) => {
					element.data = this.syllabus.days[index].manuals
					element.index = this.syllabus.days[index].index
					element.reviewed = this.syllabus.days[index].reviewed
					element.number = days[index]
				})
			} else {
				this.week.forEach((element, index) => {
					element.data = []
					element.index = []
					element.reviewed = []
					element.number = days[index]
					const numberOfCards = getRandomNumberBetween(2, 5)
					element.data = this.randomManuals(numberOfCards)
				})
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.d-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1vw;
	}
</style>
