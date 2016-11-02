<template>
<div class="commentsView">
  <div class="commentsInfo" v-show="$store.state.totalComments > 0">
    <div class="commentsCount">
      <i class="ic commentsCount-icon">chat_bubble</i> {{ $store.state.totalComments }} ความเห็น
    </div>
    <div class="commentsSort" @click="">
      เรียงตาม: เวลาโพสต์ <i class="ic">arrow_drop_down</i>
    </div>
  </div>
  <pagination></pagination>

  <comment-item v-for="comment in $store.state.shownComments" :data="comment">
  </comment-item>

  <pagination></pagination>
</div>
</template>

<script>
let Pantip = require('../pantipInterface.js');
export default { }
</script>
