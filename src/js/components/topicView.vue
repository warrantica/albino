<template>
  <div class="topic">
    <h1 class="topic-title">{{ data.title }}</h1>
    <div class="topic-info">
      <img class="topic-avatar" :src="data.avatarSrc" />
      <div class="topic-author topic-author--op">{{ data.author }}</div>
      <div class="topic-time">
        <time class="timeago" :datetime="data.utime">{{ data.timeFull }}</time>
      </div>
    </div>
    <div class="topic-tag" v-show="data.tags">
      <i class="ic topic-tagIcon">label</i> {{ data.tags }}
    </div>
    <div class="topic-content" v-html="data.content"></div>
    <reaction-view :data="data.reactionData"></reaction-view>
  </div>
</template>

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
