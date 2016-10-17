<template>
  <div class="topic sForeBg sClickable"
       :class="{active: data.isActive, top: data.isTop}"
       @click="loadTopic">
    <div class="topic-thumbnail">
      <img class="topic-thumbnailImage" :src="thumbnail" />
    </div>
    <div class="topic-text">
      <div class="topic-title" v-html="data.disp_topic"></div>
      <div class="topic-subtitle sSubtitle">
        {{ data.author }}
        &#149; <time :datetime="data.utime">{{ data.timeFull }}</time>
        <span v-show="data.comments">&#149; {{ data.comments }} <i class="ic">chat_bubble</i></span>
        <span v-show="data.votes">&#149; {{ data.votes }} <i class="ic">add_box</i></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        _id: String,
        disp_topic: String,
        cover_img: String,
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
        //this.$dispatch('loadTopic', this.data._id);
        this.$store.dispatch('loadTopicFromId', this.data._id);
      }
    },

    computed: {
      thumbnail(){
        return this.data.cover_img !== '' ? this.data.cover_img : 'asset/img/thumbnail.png';
      }
    },

    mounted(){
      $('time').timeago();
    },

    events: {
      'topicLoaded': function(topicId){
        this.data.isActive = (topicId === this.data._id) ? true : false;
      }
    }
  }
</script>
