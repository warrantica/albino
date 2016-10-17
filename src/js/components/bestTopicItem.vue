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
      }
    },

    methods: {
      loadTopic(){
        this.$store.dispatch('loadTopicFromId', this.data._id);
      }
    },

    computed: {
      isActive(){ return this.data._id === this.$store.state.currentTopic },

      thumbnail(){
        return this.data.cover_img !== '' ? this.data.cover_img : 'asset/img/thumbnail.png';
      }
    }
  }
</script>
