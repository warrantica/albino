<template>
  <style>
    .sPrimaryBg{
      background: {{ theme.primary }};
    }

    .sPrimaryText{
      color: {{ theme.primary }};
    }

    .sAccentBg{
      background: {{ theme.accent }};
    }

    .sAccentText{
      color: {{ theme.accent }};
    }
  </style>
</template>

<script>
  let Vars = require('../vars.js');

  export default {
    data(){ return {
      theme: {
        name: 'default',
        label: '',
        primary: '',
        accent: '',
      }
    }},

    events: {
      'applyTheme': function(themeName){
        this.theme = Vars.themes.find(theme => theme.name === themeName);
      }
    }
  }
</script>
