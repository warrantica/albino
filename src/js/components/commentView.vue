<template>
<div class="commentsView">
  <div class="commentsInfo" v-show="$store.state.totalComments > 0">
    <div class="commentsCount">
      <i class="ic commentsCount-icon">chat_bubble</i> {{ $store.state.totalComments }} ความเห็น
    </div>
    <div class="commentsSort" @click.stop="$store.dispatch('showDialogue', 'commentSort')">
      เรียงตาม: เวลาโพสต์ <i class="ic">arrow_drop_down</i>
    </div>
    <ul class="dialogue dialogue--commentSort"
        :class="{ 'dialogue--active': showDialogues.commentSort }">
      <li class="dialogue-item" @click="">เวลาโพสต์</li>
      <li class="dialogue-item">ความร้อนแรง</li>
      <li class="dialogue-item">เฉพาะจขกท.</li>
    </ul>
  </div>
  <pagination></pagination>

  <comment-item v-for="comment in $store.state.shownComments" :data="comment">
  </comment-item>

  <pagination></pagination>
</div>
</template>

<script>
let Pantip = require('../pantipInterface.js');
export default {
  computed: {
    showDialogues(){ return this.$store.state.showDialogues }
  }
}
</script>
