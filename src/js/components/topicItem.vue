<template>
  <div class="topic sClickable"
       :class="{active: isActive}"
       @click="loadTopic">
    <div class="type"></div>
    <div class="title">{{ data.disp_topic }}</div>
    <div class="subtitle sSubtitle">
      {{ data.author }}
      &#149; <time :datetime="data.utime">{{ data.timeFull }}</time>
      <span v-show="data.comments">&#149; {{ data.comments }} <i class="ic">chat_bubble</i></span>
      <span v-show="data.votes">&#149; {{ data.votes }} <i class="ic">add_box</i></span>
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
      voteIcon: String,
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
      $('time').timeago();
    },

    events: {
      'topicLoaded': function(topicId){
        this.isActive = topicId === this.data._id ? true : false;
      }
    }
  }
</script>
