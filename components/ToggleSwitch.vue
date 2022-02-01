<template>
<div class="d-flex toggle-switch">
  <span class="mr-2">{{ label }}</span>
  <label class="switch">
    <input type="checkbox" v-model="myVal" :disabled="disabled">
    <span class="slider round"></span>
  </label>
</div>
</template>
<script>
export default {
  name: 'toggle-switch',
  props: {
    value: {
      required: true
    },
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    myVal: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/css/variables/color-palette.scss';
/* The switch - the box around the slider */
.toggle-switch {
  .switch {
    position: relative;
    display: inline-block;
    width: 2.5rem;
    height: 1.25rem;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #FFF;
    -webkit-transition: .4s;
    transition: .4s;
    border: thin solid #{$neutral-600};
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.25rem;
    width: 1.25rem;
    left: -1px;
    bottom: -1px;
    -webkit-transition: .4s;
    transition: .4s;
    border: thin solid #{$neutral-600};
    background-color: #c7c7c7;
  }

  input:checked + .slider:before {
    background-color: #{$main-500};
    border: thin solid #{$main-500};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(1.25rem);
    -ms-transform: translateX(1.25rem);
    transform: translateX(1.25rem);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 20px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
  .disabled .slider {
    cursor: default;
    opacity: 0.8;
  }
}
</style>
