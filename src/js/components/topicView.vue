<template>
  <div class="topicWrapper">
    <h1>{{ data.title }}</h1>
    <div class="info">
      <img class="avatar" src="{{ data.avatarSrc }}" />
      <div class="author">{{ data.author }}</div>
      <div class="time sSubtitle">
        <time class="timeago" :datetime="data.utime">{{ data.timeFull }}</time>
      </div>
    </div>
    <div class="tag sSubtitle" v-show="data.tags"><i class="ic">label</i> {{ data.tags }}</div>
    <div class="content">{{{ data.content }}}</div>
    <reaction-view></reaction-view>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      data: Object
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
        if(data.avatarSrc.substr(-9, 9) === '38x38.png'){
          //unknown avatar
          data.avatarSrc = 'asset/img/default_avatar.png';
        }

        //tags
        if(data.tags.length > 0) data.tags = data.tags.join(', ');


        this.data = data;
        this.$broadcast('loadReaction', data);
        $('time.timeago').timeago();
      }
    }
  }
</script>
