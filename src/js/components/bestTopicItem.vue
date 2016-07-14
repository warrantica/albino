<template>
  <div class="topic sClickable">
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
    }
  }
</script>
