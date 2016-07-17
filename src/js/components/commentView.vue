<template>
  <div id="commentsView2">
    <comment-item></comment-item>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      comments: []
    },

    events: {
      'loadComments': function(data){

      }
    }
  }
</script>
