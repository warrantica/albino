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

    #sidebar, #belly{
      background: {{ base.back }};
      color: {{ base.text }};
    }

    #sidebarHead, #forumSelect, #leftPane,
    #leftPane .loading, #rightPane .loading,
    #leftPane .topic, #topicView, #commentsView .comment,
    #rightPane .emotionsInfo{
      background: {{ base.fore }};
    }

    #forumSelect li:hover, #leftPane .topic:hover, #leftPane .topic.active{
      background: {{ base.hover }};
    }

    .sSubtitle{ color: {{ base.subtitle }}; }
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
      },

      base: {
        name: 'light',
        fore: '',
        back: '',
        hover: ''
      }
    }},

    events: {
      'applyTheme': function(themeName){
        //this.theme = Vars.themes.find(theme => theme.name === themeName);
        this.theme = Vars.getTheme(themeName);
        this.base = Vars.getBase(this.theme.base);
      }
    }
  }
</script>
