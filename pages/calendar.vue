<template>
<b-container>
  <div v-if="dayEvents.length" class="my-4">
    <b-row>
      <b-col cols="12">
        <h3 class="mb-1" style="font-weight: bold"> Fase I </h3>
      </b-col>
    </b-row>
    <b-row class="mb-5">
      <b-col cols="12">
        <b-form-input id="range" type="range"></b-form-input>
        <div align="right">
          <h6><b>130 días</b></h6>
        </div>
      </b-col>
    </b-row>
    <vue-event-calendar :events="dayEvents" title="Temas">
      <template scope="props">
        <div v-for="(event, index) in props.showEvents" class="event-item" :key="'llave' + index">
          <div v-for="(manual, indexManuals) in event.manuals" :key="'manual' + index + indexManuals">
            <div class="item-card-done d-flex justify-content-between align-items-center" v-if="manual.finished">
              <div>
                <div class="item-manual mb-1">{{ manual.manual_name }}</div>
                <div>{{ manual.manual_subtopic_name }}</div>
              </div>
              <div class="pr-2">
                <img src="@/assets/orange_check.svg" width="33">
              </div>
            </div>
            <div class="item-card" v-else>
              <nuxt-link
              class="pointer text-decoration-none"
              target="_blank"
              :to="`/student_manual?manual_id=${manual.manual_id}`">
                <div class="item-manual">{{ manual.manual_name }}</div>
                <div>{{ manual.manual_subtopic_name }}</div>
              </nuxt-link>
            </div>
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
<style>
@media screen and (min-width: 1600px) {
  .container {
    max-width: 1400px !important;
  }
}
</style>
