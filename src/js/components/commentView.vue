<template>
  <div id="commentsView">
    <comment-item v-for="comment in comments"
                  :data="comment">
    </comment-item>
  </div>
</template>

<style scoped>
  #commentsView{
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
  }
</style>

<script>
  export default {
    props: {
      comments: []
    },

    events: {
      'loadCommentView': function(data){
        this.comments = [];
        if(data.count > 0) this.comments = data.comments;
      }
    }
  }
</script>
