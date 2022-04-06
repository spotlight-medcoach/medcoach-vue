<template>
<label class="orange-check" :class="{'disabled': disabled }">
  {{ label }}
  <span v-if="show_number">
    ({{ (number !== null) ? number : '...' }})
  </span>
  <input type="checkbox" v-model="myVal" :disabled="disabled">
  <span class="checkmark"></span>
</label>
</template>
<script>
export default {
  name: 'orange-checkbox',
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
    },
    number: {
      default: null
    },
    show_number: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    myVal: {
      get () {
        return this.value
      },
      set (myVal) {
        this.$emit('input', myVal)
      }
    }
  }
}
</script>
<style lang="scss">
  @import '@/assets/css/variables/color-palette.scss';
  /* The orange-check */
  .orange-check {
    display: block;
    position: relative;
    padding-left: 27px;
    margin-bottom: 20px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 0.90rem;
  }

  /* Hide the browser's default checkbox */
  .orange-check input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: white;
    border: thin solid #{$neutral-500};
  }

  /* On mouse-over, add a grey background color */
  .orange-check:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a orange background */
  .orange-check input:checked ~ .checkmark {
    background-color: #{$main-500};
    border: thin solid #{$main-500};
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .orange-check input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .orange-check .checkmark:after {
    left: 6px;
    width: 6px;
    bottom: 4px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .disabled {
    opacity: 0.4;
    cursor: default;
  }
  .disabled input {
    cursor: default;
  }
  .disabled:hover input ~ .checkmark  {
    background-color: white;
  }
</style>
