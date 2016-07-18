<template>
  <div class="comment sElevation1" :class="{sub:sub}">
    <div class="info">
      <img class="avatar" :src="data.user.avatar.medium" />
      <div class="author" :class="{op:data.owner_topic}">{{ data.user.name }}</div>
      <div class="time sSubtitle">
        <time class="timeago" :datetime="data.utime">{{ data.data_addrtitle }}</time>
      </div>
      <div class="numContainer sSubtitle">#{{ data.comment_no }}</div>
    </div>
    <div class="content">{{{ data.message }}}</div>
    <reaction-view></reaction-view>
    <div class="subContainer" v-if="data.reply_count">
      <comment-item v-for="reply in data.replies"
                    :data="reply" sub>
      </comment-item>
      <button class="loadMoreSubComments sElevation0h2 sPrimaryBg"
              v-show="showLoadMoreSubButton"
              @click="loadMoreSubComments">
        โหลดความเห็นย่อยเพิ่ม
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
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
        this.loadMoreSubCommentsAJAX(this.subData.last, this.subData.cid, this.subData.c, res=>{
          console.log(res.replies);
          console.log(this.data.replies);
          this.data.replies.push(...res.replies);

          this.subData.last += 5;
          if(this.subData.last >= this.subData.c) this.showLoadMoreSubButton = false;
        });
      },

      loadMoreSubCommentsAJAX(last, cid, c, callback){
        $.ajax({
          type: 'GET',
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          url:'http://pantip.com/forum/topic/render_replys?last=' + last + '&cid=' + cid + '&c=' + c + '&ac=p&o=',
          success: function(data){
            dataJSON = JSON.parse(data);
            callback(dataJSON);
          }
        });
      }
    },

    ready(){
      //comment number
      if(this.sub){
        this.data.comment_no = this.data.comment_no + '-' + this.data.reply_no;
      }else if(this.data.reply_count > 5){
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
      this.$broadcast('loadReaction', reactionData);
    },

    events: {
      'loadReaction': function(data){
        //empty event handler to stop propagation from parent comment call
      }
    }
  }
</script>
