<template>
  <div class="toolbarIcon" ref="icon">
    <i class="ic sClickable" v-text="icon"></i>
    <div class="label sPrimaryBg sElevation2"
         v-text="label"
         :style="{right:offset+'px'}"
         ref="label"></div>
  </div>
</template>

<style scoped>
  .toolbarIcon{
    display: inline-block;
    margin: 0 10px;
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
    cursor: default;
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

    mounted(){
      let center = (this.$refs.icon.offsetWidth / 2) - (this.$refs.label.offsetWidth / 2);
      let dim = this.$refs.label.getBoundingClientRect();
      if(dim.right - center > document.body.offsetWidth){
        this.offset = dim.right - document.body.offsetWidth;
      }else if(dim.right - dim.width <= 0){
        this.offset = this.$refs.icon.offsetWidth - dim.width;
      }else{
        this.offset = center;
      }
    }
  }
</script>
