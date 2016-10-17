<template>
  <div class="topicWrapper">
    <h1>{{ data.title }}</h1>
    <div class="info">
      <img class="avatar sPrimaryBg" :src="data.avatarSrc" />
      <div class="author op sAccentBg">{{ data.author }}</div>
      <div class="time sSubtitle">
        <time class="timeago" :datetime="data.utime">{{ data.timeFull }}</time>
      </div>
    </div>
    <div class="tag sSubtitle" v-show="data.tags"><i class="ic">label</i> {{ data.tags }}</div>
    <div class="content" v-html="data.content"></div>
    <reaction-view></reaction-view>
  </div>
</template>

<style scoped>
  .tag{
    padding: 15px 0 0 15px;
  }

  .tag .ic{
    font-size: 14px;
    margin-bottom: 2px;
  }
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
          tags: '',
          content: '',
          emotionCount: {
            sum: 0
          }
        }}
      }
    },

    data(){ return {
      topEmotions: []
    }},

    events: {
      'loadTopicView': function(data){
        //sanitising content
        let content = $('<div>').append(data.content);
        //no eval for you!
        $(content).find('script').remove();
        $(content).find('.review-section').remove();
        $(content).find('.edit-history').remove();
        //no polls for you!
        $(content).find('.q-poll').remove();
        $(content).find('.button-container').remove();
        data.content = content.html();

        //avatar
        if(data.avatarSrc === ''){
          //unknown avatar
          data.avatarSrc = 'asset/img/default_avatar.png';
        }

        //tags
        if(data.tags.length > 0) data.tags = data.tags.join(', ');


        this.data = data;

        //reactions
        let reactionData = {
          voteSum: data.voteCount,
          emotionSum: data.emotionCount.sum,
          emotionCounts: data.emotionCount,
          emotionSortable: data.emotions
        };
        //this.$broadcast('loadReaction', reactionData);
        $('time.timeago').timeago();
      }
    }
  }
</script>
