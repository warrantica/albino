<template>
  <div class="reactions" v-show="data.voteCount || data.emotionCount.sum">
    <div class="vote" v-show="data.voteCount">
      <i class="ic">add_box</i>{{ data.voteCount }}
    </div>
    <div class="emotions" v-show="data.emotionCount.sum">
      <div class="emotionIcons">
        <img :src="'asset/img/emotions/' + topEmotions[0].name + '.png'" v-if="topEmotions[0]" />
        <img :src="'asset/img/emotions/' + topEmotions[1].name + '.png'" v-if="topEmotions[1]" />
        <img :src="'asset/img/emotions/' + topEmotions[2].name + '.png'" v-if="topEmotions[2]" />
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
</template>

<style scoped>

</style>

<script>
  export default {
    data(){ return {
      data: {
        voteCount: 0,
        emotionCount: 0
      },
      topEmotions: []
    }},

    methods: {
      refreshData(){
        this.topEmotions = [];
        this.data.emotions.sort((a,b) => (a.count>b.count) ? -1 : ((a.count<b.count) ? 1 : 0));
        for(let emotion of this.data.emotions){
          if(emotion.count > 0) this.topEmotions.push(emotion);
        }
      }
    },

    events: {
      'loadReaction': function(data){
        this.topEmotions = [];
        data.emotions.sort((a,b) => (a.count>b.count) ? -1 : ((a.count<b.count) ? 1 : 0));
        for(let emotion of data.emotions){
          if(emotion.count > 0) this.topEmotions.push(emotion);
        }

        this.data = data;
      }
    }
  }
</script>
