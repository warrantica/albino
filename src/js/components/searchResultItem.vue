<template>
  <div class="topic sClickable" @click="loadSearchResult">
    <div class="topic-text">
      <div class="topic-title" v-html="data.disp_topic"></div>
      <div class="topic-subtitle sSubtitle">คห. {{ data.comment_num }} โดย {{ data.author }}</div>
      <div class="topic-result sSubtitle" v-html="data.content"></div>
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
