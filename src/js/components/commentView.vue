<template>
<div class="commentsView">
  <div class="commentsInfo" v-show="totalComments > 0">
    <div class="commentsCount">
      <i class="ic commentsCount-icon">chat_bubble</i>
      <span v-show="sortedComments.length !== totalComments">
        {{ sortedComments.length }} จากทั้งหมด
      </span>
      {{ totalComments }} ความเห็น
    </div>
    <div class="commentsSort" @click.stop="showDialogue('commentSort')">
      เรียงตาม: {{ sortModeLabel }}<i class="ic">arrow_drop_down</i>
    </div>
    <ul class="dialogue dialogue--commentSort"
        :class="{ 'dialogue--active': showDialogues.commentSort }">
      <li class="dialogue-item" v-for="mode in sortModes"
          v-text="mode.label"
          @click="changeSortMode(mode.value)"></li>
    </ul>
  </div>
  <pagination></pagination>

  <comment-item v-for="comment in shownComments" :data="comment">
  </comment-item>

  <pagination></pagination>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Pantip from '../pantipInterface';
import Vars from '../vars';
export default {
  data(){ return {
    sortModes: Vars.commentSortMode
  }},

  computed: {
    sortModeLabel(){
      return this.sortModes.find(mode => mode.value === this.sortMode).label;
    },

    ...mapState([
      'showDialogues',
      'totalComments',
      'sortedComments',
      'sortMode',
      'shownComments'
    ])
  },

  methods: mapActions([
    'showDialogue',
    'changeSortMode'
  ])
}
</script>
