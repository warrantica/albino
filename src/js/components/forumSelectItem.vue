<template>
  <li data-name="{{ name }}">
    <img src="asset/forumIcon/{{ name }}.png" />
    <span class="forumName"><slot></slot></span>
  </li>
</template>

<style scoped>

</style>

<script>
  export default {
    data(){ return {

    }},

    props: {
      name: String
    },

    ready(){

    }
  }
</script>
