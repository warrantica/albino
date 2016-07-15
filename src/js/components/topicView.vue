<template>
  <div class="topicWrapper">
    <h1>{{ data.title }}</h1>
    <div class="info">
      <img class="avatar" src="{{ data.avatarSrc }}" />
      <div class="author">{{ data.author }}</div>
      <div class="time sSubtitle"><time class="timeago" :datetime="data.utime">{{ data.timeFull }}</time></div>
    </div>
    <div class="tag sSubtitle" v-show="data.tags"><i class="ic">label</i> {{ data.tags }}</div>
    <div class="content">{{{ data.content }}}</div>
    <div class="reactions" v-show="data.voteCount || data.emotionCount.sum">
      <div class="vote" v-show="data.voteCount">
        <i class="ic">add_box</i>{{ data.voteCount }}
      </div>
      <div class="emotions" v-show="data.emotionCount.sum">
        <div class="emotionIcons">
          <img src="asset/img/emotions/{{ topEmotions[0].name }}.png" v-if="topEmotions[0].count" />
          <img src="asset/img/emotions/{{ topEmotions[1].name }}.png" v-if="topEmotions[1].count" />
          <img src="asset/img/emotions/{{ topEmotions[2].name }}.png" v-if="topEmotions[2].count" />
        </div>
        <div class="emotionCount">{{ data.emotionCount.sum }}</div>
      </div>
      <ul class="emotionsInfo sElevation2">
        <li><img src="asset/img/emotions/like.png"/><span>ถูกใจ {{ data.emotionCount.like }}</span></li>
        <li><img src="asset/img/emotions/laugh.png"/><span>ขำกลิ้ง {{ data.emotionCount.laugh }}</span></li>
        <li><img src="asset/img/emotions/love.png"/><span>หลงรัก {{ data.emotionCount.love }}</span></li>
        <li><img src="asset/img/emotions/impress.png"/><span>ซึ้ง {{ data.emotionCount.impress }}</span></li>
        <li><img src="asset/img/emotions/scary.png"/><span>สยอง {{ data.emotionCount.scary }}</span></li>
        <li><img src="asset/img/emotions/surprised.png"/><span>ทึ่ง {{ data.emotionCount.surprised }}</span></li>
      </ul>
    </div>
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

    methods: {

    },

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

        //reactions
        this.topEmotions = [];
        data.emotions.sort((a,b) => (a.count>b.count) ? -1 : ((a.count<b.count) ? 1 : 0));
        for(let emotion of data.emotions){
          if(emotion.count > 0) this.topEmotions.push(emotion);
        }

        this.data = data;
        $('time.timeago').timeago();
      }
    },

    ready(){

    }
  }
</script>
