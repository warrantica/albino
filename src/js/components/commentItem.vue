<template>
  <div class="comment sElevation1">
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
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default(){ return {
          title: '',
          author: '',
          utime: '',
          timeFull: '',
          message: ''
        }}
      }
    },

    data(){ return {
      topEmotions: []
    }},

    ready(){
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
    }
  }
</script>
