<template>
  <div id="commentsView">
    <div class="commentsInfo" v-show="count">
      <div class="commentsCount sBackBg">
        <i class="ic">chat_bubble</i> {{ count }} ความเห็น
      </div>
      <div class="commentsSort sBackBg">
        เรียงตาม: เวลาโพสต์
      </div>
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

  .commentsInfo{
    margin-bottom: 10px;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .commentsInfo:before{
    content: '';
    height: 1px;
    width: 100%;
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 1;
  }

  .commentsCount{
    margin-left: 10px;
    padding: 0 10px;
    z-index: 2;
  }

  .commentsSort{
    margin-right: 10px;
    padding: 0 10px;
    z-index: 2;
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
