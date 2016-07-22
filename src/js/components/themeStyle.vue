<template>
  <style>
    a:link, a:visited{
      color: {{ theme.accent }};
      border-bottom: 1px {{ theme.accent }} solid;
    }

    .author.op{ border: 1px {{ theme.accent }} solid; }

    .sPrimaryBg{ background: {{ theme.primary }}; }

    .sPrimaryText{ color: {{ theme.primary }}; }

    .sAccentBg{ background: {{ theme.accent }}; }

    .sAccentText{ color: {{ theme.accent }}; }

    .sSubtitle{ color: {{ base.subtitle }}; }

    #sidebar, #belly, .sub.comment{
      background: {{ base.back }};
      color: {{ base.text }};
    }

    #sidebarHead, #forumSelect, #leftPane,
    .loading, .topic, #topicView, .comment, .emotionsInfo{
      background: {{ base.fore }};
    }

    #forumSelect li:hover, .topic:hover, .topic.active{
      background: {{ base.hover }};
    }
  </style>
</template>

<script>
  let Vars = require('../vars.js');

  export default {
    data(){ return {
      theme: {
        name: 'default',
        label: '', primary: '', accent: '',
      },

      base: {
        name: 'light',
        fore: '', back: '', hover: ''
      }
    }},

    events: {
      'applyTheme': function(themeName){
        this.theme = Vars.getTheme(themeName);
        this.base = Vars.getBase(this.theme.base);
      }
    }
  }
</script>
