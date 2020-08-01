<template>
<label class="orange-check">{{ label }}
  <input type="checkbox" v-model="myVal">
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
<style>
  /* The orange-check */
  .orange-check {
    display: block;
    position: relative;
    padding-left: 27px;
    margin-bottom: 12px;
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
  }

  /* On mouse-over, add a grey background color */
  .orange-check:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .orange-check input:checked ~ .checkmark {
    background-color: #FE9501;
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
    left: 7px;
    width: 7px;
    bottom: 3px;
    height: 17px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>
