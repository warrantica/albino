<template>
  <style>
    a:link, a:visited{
      color: {{ theme.accent }};
      border-bottom: 1px {{ theme.accent }} solid;
    }

    .sPrimaryBg{
      background: {{ theme.primary }};
      color: {{ theme.textOnPrimary }};
    }

    .sPrimaryText{ color: {{ theme.primary }}; }

    .sAccentBg, ::selection{
      background: {{ theme.accent }};
      color: {{ theme.textOnAccent }};
    }

    .sAccentText, .result b{ color: {{ theme.accent }}; }

    .sSubtitle{ color: {{ base.subtitle }}; }

    .sBackBg, .sub.comment{
      background: {{ base.back }};
      color: {{ base.text }};
    }

    .sForeBg, .dialogue, .loading{
      background: {{ base.fore }};
    }

    .dialogue li:hover, .topic:hover, .topic.active{
      background: {{ base.hover }};
    }

    #sidebarHead, #bestTopicContainer, .searchContainer, #rightPane .info{
      border-bottom: 1px {{ border }} solid;
    }

    .top.topic, .commentsInfo:before{
      border-top: 1px {{ border }} solid;
    }

    #rightPane .content{
      font-size: {{ fontSize }}px;
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
        name: 'light', brightness: 'light',
        fore: '', back: '', hover: ''
      },

      fontSize: { label: '', value: '' },

      fontFace: { label: '', value: '' },

      border: 'rgba(255, 255, 255, 0.12)'
    }},

    events: {
      'applyTheme': function(themeName){
        this.theme = Vars.getTheme(themeName);
        this.base = Vars.getBase(this.theme.base);

        switch (this.base.brightness) {
          default: case 'light':
            this.border = 'rgba(0, 0, 0, 0.13)'; break;
          case 'dark': this.border = 'rgba(255, 255, 255, 0.13)'
        }
      },

      'applyFont': function(size, font){
        this.fontSize = size;
        this.fontFace = font;
      }
    }
  }
</script>
