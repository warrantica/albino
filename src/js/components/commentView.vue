<template>
  <div class="topicWrapper">
    <div class="info">
      <img class="avatar" :src="data.avatarSrc" />
      <div class="author">{{ data.author }}</div>
      <div class="time sSubtitle">
        <time class="timeago" :datetime="data.utime">{{ data.timeFull }}</time>
      </div>
      <div class="numContainer sSubtitle">#<span class="num"></span></div>
    </div>
    <div class="content">{{{ data.content }}}</div>
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
          content: ''
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
        $(content).find('.edit-history').remove();
        data.content = content.html();

        //avatar
        if(data.avatarSrc.substr(-9, 9) === '38x38.png'){
          //unknown avatar
          data.avatarSrc = 'asset/img/default_avatar.png';
        }

        this.data = data;
        this.$broadcast('loadReaction', data);
        $('time.timeago').timeago();
      }
    }
  }
</script>
