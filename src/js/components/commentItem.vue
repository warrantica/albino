<template>
  <div class="comment sForeBg sElevation1" :class="{sub:sub}">
    <div class="info">
      <img class="avatar sPrimaryBg" :src="data.user.avatar.medium" />
      <div class="author" :class="{op:data.owner_topic, sAccentBg:data.owner_topic}">{{ data.user.name }}</div>
      <div class="time sSubtitle">
        <time class="timeago" :datetime="data.utime">{{ data.data_addrtitle }}</time>
      </div>
      <div class="numContainer sSubtitle">#{{ commentNumber }}</div>
    </div>
    <div class="content" v-html="data.message"></div>
    <!-- <reaction-view></reaction-view> -->
    <div class="subContainer" v-if="data.reply_count">
      <comment-item v-for="reply in data.replies"
                    :data="reply" sub>
      </comment-item>
      <button class="loadMoreSubComments sButton sElevation0h2 sAccentBg"
              v-show="showLoadMoreSubButton"
              @click="loadMoreSubComments">
        โหลดความเห็นย่อยเพิ่ม
      </button>
    </div>
  </div>
</template>

<style scoped>
  .comment{
    width: 100%;
    box-sizing: border-box;
    margin: 20px 0;
    border-radius: 2px;
  }

  .subContainer{
    padding-bottom: 1px;
  }

  .sub.comment{
    width: calc(100% - 10px);
    margin-left: 10px;
    box-shadow: none;
  }

  .sub.comment:first-child{
    margin-top: 0;
  }
</style>

<script>
let Pantip = require('../pantipInterface.js');
export default {
  name: 'comment-item',

  props: {
    data: {
      type: Object,
      default(){ return {
        title: '',
        author: '',
        utime: '',
        timeFull: '',
        message: '',
        replies: []
      }}
    },

    sub: {
      type: Boolean,
      default: false
    }
  },

  data(){ return {
    commentNumber: '',
    topEmotions: [],
    showLoadMoreSubButton: false,
    subData: {
      last: 5,
      cid: '',
      c: 0
    }
  }},

  methods: {
    loadMoreSubComments(){
      Pantip.loadMoreSubComments(this.subData.last, this.subData.cid, this.subData.c).then(res=>{
        this.data.replies.push(...res.replies);
        this.subData.last += 5;
        if(this.subData.last >= this.subData.c) this.showLoadMoreSubButton = false;
      });
    }
  },

  mounted(){
    //comment number
    this.commentNumber = this.data.comment_no;
    if(this.sub){
      this.commentNumber += '-' + this.data.reply_no;
    }else if(this.data.reply_count > this.data.replies.length){
      this.subData.last = this.data.replies.length;
      this.subData.cid = this.data._id;
      this.subData.c = this.data.reply_count;
      this.showLoadMoreSubButton = true;
    }

    //avatar
    if(this.data.user.avatar.medium.substr(-9, 9) === '38x38.png'){
      //unknown avatar
      this.data.user.avatar.medium = 'asset/img/default_avatar.png';
    }

    //reactions
    let reactionData = {
      voteSum: this.data.good_bad_vote.point,
      emotionSum: this.data.emotion.sum,
      emotionCounts: {
        impress: this.data.emotion.impress.count,
        laugh: this.data.emotion.laugh.count,
        like: this.data.emotion.like.count,
        love: this.data.emotion.love.count,
        scary: this.data.emotion.scary.count,
        surprised: this.data.emotion.surprised.count,
      },
      emotionSortable: [
        {name:"impress", count:this.data.emotion.impress.count},
        {name:"laugh", count:this.data.emotion.laugh.count},
        {name:"like", count:this.data.emotion.like.count},
        {name:"love", count:this.data.emotion.love.count},
        {name:"scary", count:this.data.emotion.scary.count},
        {name:"surprised", count:this.data.emotion.surprised.count}
      ]
    };
    //load reaction
  },

  events: {
    'loadReaction': function(data){
      //empty event handler to stop propagation from parent comment call
    }
  }
}
</script>
