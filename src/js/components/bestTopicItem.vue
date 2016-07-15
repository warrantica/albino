<template>
  <div class="topic sClickable"
       @click="loadTopic">
    <div class="title"><slot></slot></div>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      tid: String,
      title: String
    },

    methods: {
      loadTopic(){
        this.$dispatch('loadTopic', this.tid);
      }
    }
  }
</script>
