<template>
  <div class="reactions" v-show="data.voteSum || data.emotionSum">
    <div class="vote" v-show="data.voteSum">
      <i class="ic">add_box</i>{{ data.voteSum }}
    </div>
    <div class="emotions" v-show="data.emotionSum">
      <div class="emotionIcons">
        <img :src="'asset/img/emotions/' + topEmotions[0].name + '.png'" v-if="topEmotions[0]" />
        <img :src="'asset/img/emotions/' + topEmotions[1].name + '.png'" v-if="topEmotions[1]" />
        <img :src="'asset/img/emotions/' + topEmotions[2].name + '.png'" v-if="topEmotions[2]" />
      </div>
      <div class="emotionCount">{{ data.emotionSum }}</div>
    </div>
    <ul class="emotionsInfo sElevation2">
      <li><img src="asset/img/emotions/like.png"/><span>ถูกใจ {{ data.emotionCounts.like }}</span></li>
      <li><img src="asset/img/emotions/laugh.png"/><span>ขำกลิ้ง {{ data.emotionCounts.laugh }}</span></li>
      <li><img src="asset/img/emotions/love.png"/><span>หลงรัก {{ data.emotionCounts.love }}</span></li>
      <li><img src="asset/img/emotions/impress.png"/><span>ซึ้ง {{ data.emotionCounts.impress }}</span></li>
      <li><img src="asset/img/emotions/scary.png"/><span>สยอง {{ data.emotionCounts.scary }}</span></li>
      <li><img src="asset/img/emotions/surprised.png"/><span>ทึ่ง {{ data.emotionCounts.surprised }}</span></li>
    </ul>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    data(){ return {
      data: {
        voteSum: 0,
        emotionSum: 0,
        emotionCounts: {},
        emotionSortable: []
      },
      topEmotions: []
    }},

    events: {
      'loadReaction': function(data){
        this.topEmotions = [];
        data.emotionSortable.sort((a,b) => (a.count>b.count) ? -1 : ((a.count<b.count) ? 1 : 0));
        for(let emotion of data.emotionSortable){
          if(emotion.count > 0) this.topEmotions.push(emotion);
        }

        this.data = data;
      }
    }
  }
</script>
