<template>
  <div class="topicItem"
       :class="{'topicItem--active': isActive, 'topicItem--top': data.isTop}"
       @click="loadTopic">
    <div class="topicItem-thumbnail">
      <img class="topicItem-thumbnailImage" :src="thumbnail" />
    </div>
    <div class="topicItem-text">
      <div class="topicItem-title" v-html="data.disp_topic"></div>
      <div class="topicItem-subtitle">
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
      this.$store.dispatch('loadTopic', this.data._id);
    }
  },

  computed: {
    isActive(){ return this.data._id === this.$store.state.topicId },

    thumbnail(){
      return this.data.cover_img !== '' ? this.data.cover_img : 'asset/img/thumbnail.png';
    }
  },

  mounted(){
    $('time').timeago();
  }
}
</script>
