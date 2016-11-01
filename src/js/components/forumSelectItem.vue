<template>
<li class="dialogue-item dialogue-item--forumSelect" @click="loadForum">
  <img class="dialogue-icon" :src="'asset/forumIcon/'+name+'.png'" />
  <slot></slot>
</li>
</template>

<script>
export default {
  props: {
    name: String
  },

  methods: {
    loadForum(){
      this.$store.dispatch('loadTopics', {forumName: this.name});
    }
  }
}
</script>
