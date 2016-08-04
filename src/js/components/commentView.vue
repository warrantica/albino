<template>
  <div id="commentsView">
    <div>
      จำนวน: {{ count }}
    </div>
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

    data(){ return {
      count: 0
    }},

    events: {
      'loadCommentView': function(data){
        this.comments = [];
        this.count = data.count;
        if(data.count > 0) this.comments = data.comments;
      }
    }
  }
</script>
