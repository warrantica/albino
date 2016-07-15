<template>
  <div class="topic sClickable"
       :class="{active: isActive}"
       @click="loadTopic">
    <div class="title"><slot></slot></div>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      tid: String,
      title: String,
      isActive: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      loadTopic(){
        this.$dispatch('loadTopic', this.tid);
      }
    },

    events: {
      'topicLoaded': function(topicId){
        this.isActive = topicId === this.tid ? true : false;
      }
    }
  }
</script>
