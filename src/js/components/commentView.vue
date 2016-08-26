<template>
  <div id="commentsView">
    <div class="commentsInfo" v-show="count">
      <div class="commentsCount sBackBg">
        <i class="ic">chat_bubble</i> {{ count }} ความเห็น
      </div>
      <div class="commentsSort sBackBg">
        เรียงตาม: เวลาโพสต์ <i class="ic">arrow_drop_down</i>
      </div>
    </div>
    <div class="pagination">
      <i class="ic sClickable" @click="goToPage(currentPage-1)">chevron_left</i>
      <span class="page sClickable"
            v-for="page in totalPages"
            :class="{ sAccentBg: page==currentPage, current: page==currentPage }"
            @click="goToPage(page)">
        {{ page+1 }}
      </span>
      <i class="ic sClickable" @click="goToPage(currentPage+1)">chevron_right</i>
    </div>
    <comment-item v-for="comment in currentComments"
                  transition="fade"
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

  .commentsCount i{
    font-size: 14px;
    margin-bottom: 1px;
  }

  .commentsSort{
    margin-right: 10px;
    padding: 0 10px;
    z-index: 2;
  }

  .pagination{
    width: 100%;
    text-align: center;
  }

  .page{
    display: inline-block;
    width: 18px;
    line-height: 18px;
    padding: 5px;
    margin: 5px;
    border-radius: 50%;
    transition: all .2s ease;
  }

  .fade-transition{ opacity:1; transition: all .3s ease; }
  .fade-enter, .fade-leave{ opacity: 0; }
</style>

<script>
  export default {
    props: {
      comments: []
    },

    data(){ return {
      count: 0,
      commentsPerPage: 5,
      currentPage: 0,
      currentComments: []
    }},

    computed: {
      totalPages(){
        return Math.ceil(this.count/this.commentsPerPage);
      }
    },

    methods: {
      goToPage(pageNumber){
        if(pageNumber < 0 || pageNumber >= this.totalPages) return false;

        this.currentComments = [];
        let start = pageNumber*this.commentsPerPage;
        this.currentComments = this.comments.slice(start, start + this.commentsPerPage);
        console.log(this.currentComments);
        this.currentPage = pageNumber;
      }
    },

    events: {
      'loadCommentView': function(data, isRefresh){
        //get commentsPerPage from options
        chrome.storage.sync.get({ commentsPerPage: '5' }, item => {
          //do stuff that needs commentsPerPage value in callback
          this.commentsPerPage = parseInt(item.commentsPerPage);

          this.comments = [];
          this.count = data.count;
          if(data.count > 0) this.comments = data.comments;

          if(this.commentsPerPage < this.count){
            if(isRefresh){
              let start = this.currentPage*this.commentsPerPage;
              this.currentComments = this.comments.slice(start, start + this.commentsPerPage);
            }else{
              this.currentPage = 0;
              this.currentComments = this.comments.slice(0, this.commentsPerPage);
            }
          }else{
            this.currentPage = 0;
            this.currentComments = this.comments;
          }
        });
      }
    }
  }
</script>
