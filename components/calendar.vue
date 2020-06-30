<template>
  <vue-event-calendar :events="demoEvents"></vue-event-calendar>
</template>

<script>
export default {
  props: {
    days: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      demoEvents: [{
        date: '2020/11/12', // Required
        title: 'Foo' // Required
      }, {
        date: '2020/12/15',
        title: 'Bar',
        desc: 'description',
        customClass: 'disabled highlight' // Custom classes to an calendar cell
      }]
    }
  }
}
</script>
