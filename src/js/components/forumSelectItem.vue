<template>
  <li @click="loadForum">
    <img src="asset/forumIcon/{{ name }}.png" />
    <span class="forumName"><slot></slot></span>
  </li>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      name: String
    },

    methods: {
      loadForum(){
        this.$dispatch('loadForum', this.name);
      }
    }
  }
</script>
