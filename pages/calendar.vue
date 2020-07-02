<template>
<b-container>
  <div v-if="dayEvents.length" class="my-5">
    <b-row class="my-1">
      <b-col cols="12">
        <label for="range">Fase I</label>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col cols="12">
        <b-form-input id="range" type="range"></b-form-input>
      </b-col>
    </b-row>
    <vue-event-calendar :events="dayEvents" title="Temas">
      <template scope="props">
        <div v-for="(event, index) in props.showEvents" class="event-item" :key="'llave' + index">
          <!-- In here do whatever you want, make you owner event template -->
          {{ event.date }}
          <div v-for="(manual, indexManuals) in event.manuals" :key="'manual' + index + indexManuals">
            {{ manual.manual_name }} - {{ manual.manual_subtopic_name }}
          </div>
        </div>
      </template>
    </vue-event-calendar>
  </div>
  <div v-else-if="syllabus_error">
    <div class="mt-5 d-flex justify-content-around" style="font-size: 28px;">
      Error al obtener el Calendario
    </div>
  </div>
  <div v-else>
    <div class="mt-5 d-flex justify-content-around" style="font-size: 28px;">
      Cargando calendario, por favor espere
    </div>
    <div class="mt-5 d-flex justify-content-around">
      <img src="@/assets/loading.svg" width="100" />
    </div>
  </div>
</b-container>
</template>

<script>

export default {
  data () {
    return {
      days: null,
      syllabus_error: false,
      demoEvents: [
        {
          date: '2020/06/12', // Required
          title: 'Foo' // Required
        }, {
          date: '2020/06/15',
          title: 'Bar',
          desc: 'description',
          customClass: 'disabled highlight' // Custom classes to an calendar cell
        }
      ]
    }
  },
  async created () {
    const now = new Date()
    const actualDay = parseInt(now.getUTCDate())
    const minDay = 1 - actualDay
    const maxDay = 31 - actualDay
    await this.fetchSyllabus(minDay, maxDay)
  },
  computed: {
    dayEvents () {
      let events = []
      if (this.days) {
        events = this.days.filter((day) => {
          if (day.manuals.length) {
            day.date = day.date.replace(/-/g, '/')
            day.date = day.date.replace(/\/0/g, '/')
            day.title = 'Titulo'
            return true
          }
          return false
        })
        const actual = events.find(event => event.index === 0)
        this.$EventCalendar.toDate(actual.date || '')
      }
      return events
    }
  },
  methods: {
    fetchSyllabus (minDay, maxDay) {
      return this.$axios
        .post('/students/syllabus', {
          min_index: minDay,
          max_index: maxDay,
          days_disabled: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          this.days = response.data.days
        })
        .catch((error) => {
          this.syllabus_error = true
          console.error(error)
        })
    }
  }
}
</script>
