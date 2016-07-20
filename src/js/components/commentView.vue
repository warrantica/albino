<template>
  <div id="commentsView">
    <comment-item v-for="comment in comments"
                  :data="comment">
    </comment-item>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      comments: []
    },

    events: {
      'loadCommentView': function(data){
        this.comments = [];
        if(data.count > 0){
          this.comments = data.comments;
        }
      }
    }
  }
</script>
