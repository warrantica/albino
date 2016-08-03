<template>
  <div class="topic sClickable" @click="loadSearchResult">
    <div class="title">{{{ data.disp_topic }}}</div>
    <div class="result">{{ data.content }}</div>
    <div class="subtitle sSubtitle">
      โดย {{ data.author }}
    </div>
  </div>
</template>

<style scoped>
  .result{
    
  }
</style>

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
