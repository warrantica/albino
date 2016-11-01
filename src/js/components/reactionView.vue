<template>
<div class="reactions" v-if="data.voteSum || data.emotionSum">
  <div class="reactions-vote" v-show="data.voteSum">
    <i class="ics reactions-voteIcon">add_box</i>{{ data.voteSum }}
  </div>
  <div class="reactions-emotions" v-show="data.emotionSum">
    <div class="reactions-topEmotions">
      <img :src="`asset/img/emotions/${topEmotions[0].name}.png`" class="reactions-topIcon" v-if="topEmotions[0]" />
      <img :src="`asset/img/emotions/${topEmotions[1].name}.png`" class="reactions-topIcon" v-if="topEmotions[1]" />
      <img :src="`asset/img/emotions/${topEmotions[2].name}.png`" class="reactions-topIcon" v-if="topEmotions[2]" />
    </div>
    {{ data.emotionSum }}
  </div>
  <ul class="reactions-info">
    <li class="reactions-infoItem">
      <img class="reactions-infoIcon" src="asset/img/emotions/like.png"/>
      ถูกใจ {{ data.emotionCounts.like }}
    </li>
    <li class="reactions-infoItem">
      <img class="reactions-infoIcon" src="asset/img/emotions/laugh.png"/>
      ขำกลิ้ง {{ data.emotionCounts.laugh }}
    </li>
    <li class="reactions-infoItem">
      <img class="reactions-infoIcon" src="asset/img/emotions/love.png"/>
      หลงรัก {{ data.emotionCounts.love }}
    </li>
    <li class="reactions-infoItem">
      <img class="reactions-infoIcon" src="asset/img/emotions/impress.png"/>
      ซึ้ง {{ data.emotionCounts.impress }}
    </li>
    <li class="reactions-infoItem">
      <img class="reactions-infoIcon" src="asset/img/emotions/scary.png"/>
      สยอง {{ data.emotionCounts.scary }}
    </li>
    <li class="reactions-infoItem">
      <img class="reactions-infoIcon" src="asset/img/emotions/surprised.png"/>
      ทึ่ง {{ data.emotionCounts.surprised }}
    </li>
  </ul>
</div>
</template>

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
      if(this.data.emotionSortable === undefined) return [];
      this.data.emotionSortable.sort((a,b) => (a.count>b.count) ? -1 : ((a.count<b.count) ? 1 : 0));
      for(let emotion of this.data.emotionSortable){
        if(emotion.count > 0) topEmotions.push(emotion);
      }

      return topEmotions;
    }
  }
}
</script>
