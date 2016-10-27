<template>
  <div class="topic">
    <h1 class="topic-title">{{ data.title }}</h1>
    <div class="info">
      <img class="avatar sPrimaryBg" :src="data.avatarSrc" />
      <div class="author op sAccentBg">{{ data.author }}</div>
      <div class="time sSubtitle">
        <time class="timeago" :datetime="data.utime">{{ data.timeFull }}</time>
      </div>
    </div>
    <div class="tag sSubtitle" v-show="data.tags"><i class="ic">label</i> {{ data.tags }}</div>
    <div class="topic-content" v-html="data.content"></div>
    <reaction-view :data="data.reactionData"></reaction-view>
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
    }
  }
</script>
