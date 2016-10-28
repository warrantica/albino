<template>
<div class="topic comment sForeBg sElevation1" :class="{'comment--sub':sub}">
  <div class="topic-info">
    <img class="topic-avatar" :src="data.user.avatar.medium" />
    <div class="topic-author" :class="{'topic-author--op':data.owner_topic }">
      {{ data.user.name }}
    </div>
    <div class="topic-time">
      <time class="timeago" :datetime="data.utime">{{ data.data_addrtitle }}</time>
    </div>
    <div class="topic-commentNumber">#{{ data.commentNumber }}</div>
  </div>
  <div class="topic-content" v-html="data.message"></div>
  <reaction-view :data="data.reactionData"></reaction-view>
  <div class="comment-subContainer" v-if="data.reply_count">
    <comment-item v-for="reply in data.replies"
                  :data="reply" sub>
    </comment-item>
    <button class="topic-loadMore"
            v-show="data.showLoadMoreSubButton"
            @click="loadMoreSubComments">
      โหลดความเห็นย่อยเพิ่ม
    </button>
  </div>
</div>
</template>

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
