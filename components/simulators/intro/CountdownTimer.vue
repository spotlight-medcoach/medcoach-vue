<template>
  <div>
    <p v-if="count">{{count}} hrs</p>
  </div>
</template>
<script>
import moment from 'moment/moment'
export default {
  props: {
    startTime: {
      type: String,
      required: true
    },
    durationTime: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      count: null,
      countdown: ''
    }
  },
  created () {
    const StartBlock = parseInt(this.startTime)
    const date = moment(StartBlock)
    const today = moment()
    const milliseconds = today.diff(date, 'milliseconds')
    console.log(milliseconds)
    const time = this.durationTime - milliseconds
    let duration = moment.duration(time, 'milliseconds')
    this.countdown = setInterval(() => {
      duration = moment.duration(duration - 1000, 'milliseconds')
      this.count = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
      if (duration.asMilliseconds() <= 0) {
        this.$emit('onTimeOver', 'Se acabo el tiempo')
        clearInterval(this.countdown)
      }
    }, 1000)
  }
}
</script>
