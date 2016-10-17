<template>
  <input type="radio" name="theme" :id="name" :value="name" v-model="$parent.options.theme">
  <label :for="name">
    <div class="colorSample" :style="{background:primary}">
      <div class="baseColor" :style="{background:baseData.fore}"></div>
      <div class="accentSample" :style="{background:accent}"></div>
    </div>
    <div class="labelText">{{ label }}</div>
  </label>
</template>

<style scoped>
  input{ display: none; }

  label{
    display: block;
    padding: 5px 10px;
    transition: all .2s ease;
    cursor: pointer;
  }

  .colorSample{
    display: inline-block;
    margin-right: 10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    vertical-align: middle;
    position: relative; top: 0; left: 0;
    transition: all .2s ease;
  }

  .baseColor{
    width: 26px;
    height: 13px;
    border-radius: 0 0 26px 26px;
    margin: 16px 0 0 3px;
  }

  .accentSample{
    position: absolute;
    bottom: 0; right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .labelText{
    display: inline-block;
    font-size: 16px;
    vertical-align: middle;
  }

  input:checked + label{
    background: #e3e3e3;
  }

  input:checked + label .colorSample, label:hover .colorSample{
    transform: scale(1.1);
  }
</style>

<script>
  let Vars = require('../vars.js');

  export default {
    props: {
      label: String,
      name: String,
      primary: String,
      accent: String,
      base: String,
      checked: {
        type: Boolean,
        default: false
      }
    },

    data(){ return {
      baseData: {
        name: '', fore: '', back: ''
      }
    }},

    mounted(){
      this.baseData = Vars.getBase(this.base);
    }
  }
</script>
