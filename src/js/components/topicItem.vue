<template>
  <div class="topic sClickable"
       :class="{active: data.isActive, top: data.isTop}"
       @click="loadTopic">
    <div class="type"></div>
    <div class="title">{{{ data.disp_topic }}}</div>
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
        _id: String,
        disp_topic: String,
        author: String,
        commentsNum: Number,
        utime: String,
        timeFull: String,
        isActive: {
          type: Boolean,
          default: false
        },
        isTop: {
          type: Boolean,
          default: false
        }
      },
      commentIcon: String,
      voteIcon: String,
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
        console.log("ID: " + this.data._id + " " + this.data.isActive);
        this.data.isActive = (topicId === this.data._id) ? true : false;
      }
    }
  }
</script>
