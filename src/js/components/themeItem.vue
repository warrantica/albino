<template>
  <input type="radio" name="theme" :id="name" :value="name">
  <label :for="name">
    <div class="colorSample"></div>
    <div class="labelText">{{ label }}</div>
  </label>
</template>

<style scoped>
  input{
    display: none;
  }

  label{
    display: block;
    margin: 10px 0;
  }

  .colorSample{
    display: inline-block;
    margin-right: 10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: red;
    vertical-align: middle;
  }

  .labelText{
    display: inline-block;
    font-size: 16px;
    vertical-align: middle;
  }

  input:checked + label{
    background: red;
  }
</style>

<script>
  export default {
    props: {
      label: String,
      name: String,
      checked: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
