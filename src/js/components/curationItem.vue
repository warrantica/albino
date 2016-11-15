<template>
<div class="topicItem"
     :class="{'topicItem--active': isActive}"
     @click="loadTopic">
  <div class="topicItem-thumbnail">
    <img class="topicItem-thumbnailImage" :src="thumbnail" />
  </div>
  <div class="topicItem-text">
    <div class="topicItem-title" v-html="data.disp_topic"></div>
    <div class="topicItem-subtitle">
      {{ data.author }}
    </div>
  </div>
</div>
</template>

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
      this.$store.dispatch('loadTopic', this.data._id);
    }
  },

  computed: {
    isActive(){ return this.data._id === this.$store.state.topicId },

    thumbnail(){
      return this.data.cover_img !== '' ? this.data.cover_img : 'asset/img/thumbnail.png';
    }
  }
}
</script>
