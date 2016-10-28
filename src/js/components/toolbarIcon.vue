<template>
<div class="toolbarIcon" ref="icon">
  <i class="ics toolbarIcon-icon" v-text="icon"></i>
  <div class="toolbarIcon-label"
       v-text="label"
       :style="{right:offset+'px'}"
       ref="label"></div>
</div>
</template>

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
