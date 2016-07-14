<template>
  <div class="type"></div>
  <div class="title"></div>
  <div class="subtitle sSubtitle">
    <span class="author"></span> &#149; <time class="timeago"></time> &#149; <span class="commentsNum"></span> <i class="ic">chat_bubble</i>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      title: String,
      tid: String
    }
  }
</script>
