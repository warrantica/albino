<template>
  <div class="topic sForeBg sClickable"
       :class="{active: isActive}"
       @click="loadTopic">
    <div class="topic-thumbnail">
      <img class="topic-thumbnailImage" :src="thumbnail" />
    </div>
    <div class="topic-text">
      <div class="topic-title" v-html="data.disp_topic"></div>
      <div class="topic-subtitle sSubtitle">
        {{ data.author }}
      </div>
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

    computed: {
      thumbnail(){
        return this.data.cover_img !== '' ? this.data.cover_img : 'asset/img/thumbnail.png';
      }
    },

    events: {
      'topicLoaded': function(topicId){
        this.isActive = topicId === this.data._id ? true : false;
      }
    }
  }
</script>
