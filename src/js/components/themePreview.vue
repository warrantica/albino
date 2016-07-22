<template>
  <div class="themePreview">
    <div class="container">
      <div class="sidebar" :style="{background:baseLight}">

      </div>
      <div class="belly" :style="{background:baseDark}">
          <div class="header" :style="{background:theme.primary}">
            ตัวอย่างหัวข้อกระทู้
          </div>
          <div class="content" :style="{background:baseLight}"></div>
          <div class="fab" :style="{background:theme.accent}"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  div{ transition: background-color .2s ease; }

  .themePreview{
    display: inline-block;
    width: 40%;
    height: 120px;
    margin-left: 5%;
    margin-top: 20px;
    vertical-align: top;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    position: relative; top: 0; left: 0;
  }

  .sidebar{
    display: inline-block;
    width: 30%;
  }

  .belly{
    flex: 1;
  }

  .header{
    height: 20px;
    padding: 0 2px;
    color: #fff;
    font-size: 10px;
    line-height: 20px;
  }

  .content{
    width: 50%;
    height: 60px;
    margin: 5px auto 0 auto;
  }

  .fab{
    width: 18px;
    height: 18px;
    border-radius: 50%;
    position: absolute;
    bottom: 5px; right: 5px;
  }
</style>

<script>
  let Vars = require('../vars.js');

  export default {
    props: {
      themeName: {
        type: String,
        default: 'default'
      }
    },

    data(){ return {
      baseColor: '#f5f5f5'
    }},

    computed: {
      theme(){
        return Vars.themes.find(theme => theme.name === this.themeName);
      },

      baseDark(){
        switch(this.theme.base){
          default: case 'light': return '#eaeaea';
          case 'dark': return '#212121';
        }
      },

      baseLight(){
        switch(this.theme.base){
          default: case 'light': return '#ffffff';
          case 'dark': return '#303030';
        }
      }
    }
  }
</script>
