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
    <ul class="emotionsInfo sForeBg sElevation2">
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
  .reactions{
    padding: 0 15px 15px 15px;
    line-height: 28px;
    position: relative; top: 0; left: 0;
  }

  .vote{
    display: inline-block;
    margin-right: 10px;
    height: 28px;
    vertical-align: top;
  }

  .emotions, .emotionIcons{
    display: inline-block;
    height: 28px;
  }

  .emotionIcons img{
    width: 18px;
    height: auto;
    margin-bottom: 5px;
  }

  .emotionIcons img:first-child{
    width: 28px;
    margin-bottom: 0;
  }

  .emotionCount{
    display: inline-block;
    vertical-align: top;
  }

  .emotionsInfo{
    position: absolute;
    top: -40px;
    left: 10px;
    padding: 10px 10px 0 10px;
    -webkit-clip-path: circle(0 at 80px 100%);
    transition: all .15s ease-in-out;
  }

  .emotions:hover + .emotionsInfo{
    -webkit-clip-path: circle(100% at 50% 50%);
  }

  .emotionsInfo li{
    display: inline-block;
    height: 18px;
    line-height: 18px;
    margin-right: 10px;
  }

  .emotionsInfo img{
    width: 18px;
    margin-right: 5px;
  }

  .emotionsInfo span{
    vertical-align: top;
  }
</style>

<script>
export default {
  props: {
    data: {
      type: Object,
      default(){ return {
        voteSum: 0,
        emotionSum: 0,
        emotionCounts: {},
        emotionSortable: []
      }}
    }
  },

  computed: {
    topEmotions(){
      let topEmotions = [];
      if(this.data === undefined) return [];
      this.data.emotionSortable.sort((a,b) => (a.count>b.count) ? -1 : ((a.count<b.count) ? 1 : 0));
      for(let emotion of this.data.emotionSortable){
        if(emotion.count > 0) topEmotions.push(emotion);
      }

      return topEmotions;
    }
  }
}
</script>
