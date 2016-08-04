<template>
  <div class="topic sForeBg sClickable"
       :class="{active: isActive}"
       @click="loadTopic">
    <div class="title">{{ data.disp_topic }}</div>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      data: {
        _id: String,
        disp_topic: String
      },
      isActive: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      loadTopic(){
        this.$dispatch('loadTopic', this.data._id);
      }
    },

    events: {
      'topicLoaded': function(topicId){
        this.isActive = topicId === this.data._id ? true : false;
      }
    }
  }
</script>
