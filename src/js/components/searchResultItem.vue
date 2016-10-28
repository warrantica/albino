<template>
  <div class="topicItem" @click="loadSearchResult">
    <div class="topicItem-text">
      <div class="topicItem-title" v-html="data.disp_topic"></div>
      <div class="topicItem-subtitle">คห. {{ data.comment_num }} โดย {{ data.author }}</div>
      <div class="topicItem-result" v-html="data.content"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        disp_topic: String,
        author: String,
        comment_num: String,
        topic_link: String,
        content: String
      }
    },

    methods: {
      loadSearchResult(){
        this.$store.dispatch('loadSearchResult', this.data.topic_link);
      }
    }
  }
</script>
