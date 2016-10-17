<template>
  <div class="topic sClickable" @click="loadSearchResult">
    <div class="title" v-html="data.disp_topic"></div>
    <div class="subtitle sSubtitle">คห. {{ data.comment_num }} โดย {{ data.author }}</div>
    <div class="result sSubtitle" v-html="data.content"></div>
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
        this.$dispatch('loadSearchResult', this.data.topic_link);
      }
    }
  }
</script>
