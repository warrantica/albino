<template>
  <div class="topic sClickable"
       :class="{active: isActive}"
       @click="loadTopic">
    <div class="type"></div>
    <div class="title"><slot></slot></div>
    <div class="subtitle sSubtitle">
      <span class="author">{{ data.author }}</span> &#149;
      <time class="timeago" :datetime="data.utime">{{ data.timeFull }}</time> &#149;
      <span class="commentsNum">{{ data.comments }}</span> <i class="ic">{{ commentIcon }}</i>
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      data: {
        id: String,
        title: String,
        author: String,
        commentsNum: Number,
        utime: String,
        timeFull: String
      },
      commentIcon: String,
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

    ready(){
      this.commentIcon = +this.data.comments === 0
        ? 'chat_bubble_outline'
        : 'chat_bubble';
      $('time.timeago').timeago();
    },

    events: {
      'topicLoaded': function(topicId){
        this.isActive = topicId === this.data._id ? true : false;
      }
    }
  }
</script>
