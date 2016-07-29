<template>
  <div class="toolbarIcon sClickable" v-el:icon>
    <i class="ic" v-text="icon"></i>
    <div class="label sPrimaryBg sElevation2"
         v-text="label"
         :style="{right:offset+'px'}"
         v-el:label></div>
  </div>
</template>

<style scoped>
  .toolbarIcon{
    display: inline-block;
    line-height: 1;
    position: relative; top: 0; right: 0;
    z-index: 15;
  }

  .label{
    display: block;
    padding: 8px 10px;
    border-radius: 2px;
    position: absolute;
    bottom: -27px;
    white-space: nowrap;
    opacity: 0;
    transition: all .1s ease;
  }

  .ic:hover + .label{
    bottom: -30px;
    opacity: 1;
  }
</style>

<script>
  export default {
    props: {
      icon: String,
      label: String
    },

    data(){ return {
      offset: 0
    }},

    ready(){
      let center = (this.$els.icon.offsetWidth / 2) - (this.$els.label.offsetWidth / 2);
      let dim = this.$els.label.getBoundingClientRect();
      if(dim.right - center > document.body.offsetWidth){
        this.offset = dim.right - document.body.offsetWidth;
      }else{
        this.offset = center
      }
    }
  }
</script>
