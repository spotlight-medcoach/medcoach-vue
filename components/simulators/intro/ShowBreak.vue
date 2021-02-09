<template>
  <div id="break">
    <div class="m-auto text-center">
      <p class="rest m-auto">Descanso</p>
      <countdown-timer
        class="timer m-auto"
        :durationTime="duration"
        :startTime="startTimeBreak"
        @onTimeOver="finishBreak"
      />
      <button
        class="btn-skip m-auto btn-sec"
        @click="finishBreak"
      >
        OMITIR
      </button>
    </div>
  </div>
</template>
<script>
import CountdownTimer from '@/components/simulators/intro/CountdownTimer'
export default {
  components: {
    CountdownTimer
  },
  props: {
    duration: {
      type: Number,
      required: true
    },
    startTimeBreak: {
      type: String,
      required: true
    }
  },
  methods: {
    finishBreak () {
      this.$emit('onFinishBreak', true)
    }
  }
}
</script>
