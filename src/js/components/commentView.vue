<template>
  <div id="commentsView">
    <div class="commentsInfo" v-show="$store.state.totalComments">
      <div class="commentsCount sBackBg">
        <i class="ic">chat_bubble</i> {{ $store.state.totalComments }} ความเห็น
      </div>
      <div class="commentsSort sBackBg">
        เรียงตาม: เวลาโพสต์ <i class="ic">arrow_drop_down</i>
      </div>
    </div>
    <pagination :comments-per-page="$store.state.commentsPerPage"></pagination>

    <comment-item v-for="comment in $store.state.shownComments" :data="comment">
    </comment-item>

    <pagination :comments-per-page="$store.state.commentsPerPage"></pagination>
    <div v-show="$store.state.totalComments && !$store.state.shownComments.length">
      <i class="ic">hourglass_full</i> loading...
    </div>
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

  .commentsCount i{
    font-size: 14px;
    margin-bottom: 1px;
  }

  .commentsSort{
    margin-right: 10px;
    padding: 0 10px;
    z-index: 2;
  }

  .fade-enter-active, .fade-leave-active{ opacity:1; transition: all .3s ease; }
  .fade-enter, .fade-leave-active{ opacity: 0; }
</style>

<script>
  let Pantip = require('../pantipInterface.js');
  export default {
    props: {
      comments: []
    },

    data(){ return {
      loadedPage: 1
    }},

    computed: {
      totalPages(){
        return Math.ceil(this.count/this.commentsPerPage);
      }
    },

    methods: {
      loadMoreComments(pageNumber){
        let start = pageNumber*this.commentsPerPage;
        Pantip.loadComments(this.topicId, ++this.loadedPage).then(data => {
          this.comments.push(...data.comments);
          this.currentComments = this.comments.slice(start, start + this.commentsPerPage);

          //DANGER!?
          if(this.currentComments.length === 0) this.loadMoreComments(pageNumber);
        });
      }
    }
  }
</script>
