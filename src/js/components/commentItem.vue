<template>
  <div class="comment sForeBg sElevation1" :class="{sub:sub}">
    <div class="info">
      <img class="avatar sPrimaryBg" :src="data.user.avatar.medium" />
      <div class="author" :class="{op:data.owner_topic, sAccentBg:data.owner_topic}">{{ data.user.name }}</div>
      <div class="time sSubtitle">
        <time class="timeago" :datetime="data.utime">{{ data.data_addrtitle }}</time>
      </div>
      <div class="numContainer sSubtitle">#{{ data.commentNumber }}</div>
    </div>
    <div class="topic-content" v-html="data.message"></div>
    <reaction-view :data="data.reactionData"></reaction-view>
    <div class="subContainer" v-if="data.reply_count">
      <comment-item v-for="reply in data.replies"
                    :data="reply" sub>
      </comment-item>
      <button class="loadMoreSubComments sButton sElevation0h2 sAccentBg"
              v-show="data.showLoadMoreSubButton"
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
import Pantip from '../pantipInterface';
import Helper from '../helpers';

export default {
  props: {
    data: {
      type: Object,
      default(){ return {
        title: '',
        author: '',
        utime: '',
        timeFull: '',
        message: '',
        replies: [],
        user: {},
        commentNumber: 0,
        subData: {},
        showLoadMoreSubButton: false,
        reactionData: {}
      }}
    },

    sub: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    loadMoreSubComments(){
      Pantip.loadMoreSubComments(this.data.subData.last, this.data.subData.cid, this.data.subData.c).then(res=>{
        res.replies.forEach((element, index, array) => {
          this.data.replies.push(Helper.vetComment(element, true));
        })

        this.data.subData.last += 5;
        this.data.showLoadMoreSubButton = this.data.subData.last < this.data.subData.c;
      });
    }
  }
}
</script>
