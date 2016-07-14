<template>
  <div class="topic sClickable"
       :class="data.id"
       @click="loadTopic">
    <div class="type"></div>
    <div class="title"><slot></slot></div>
    <div class="subtitle sSubtitle">
      <span class="author">{{ data.author }}</span> &#149;
      <time class="timeago" :datetime="data.utime">{{ data.timeFull }}</time> &#149;
      <span class="commentsNum">{{ data.commentsNum }}</span> <i class="ic">{{ commentIcon }}</i>
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
      commentIcon: String
    },

    methods: {
      loadTopic(){
        console.log("loading id: " + this.data.id);
        this.$dispatch('loadTopic', this.data.id);
      }
    },

    ready(){
      this.commentIcon = +this.data.commentsNum === 0
        ? 'chat_bubble_outline'
        : 'chat_bubble';
      $('time.timeago').timeago();
    }
  }
</script>
