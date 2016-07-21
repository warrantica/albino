<template>
  <li @click="loadForum">
    <img :src="'asset/forumIcon/'+name+'.png'" />
    <span><slot></slot></span>
  </li>
</template>

<style scoped>
  li{
    padding: 10px 20px;
    height: 36px;
    line-height: 36px;
    transition: .2s all ease-in-out;
  }

  img{
    height: 36px;
    margin-right: 15px;
  }

  span{
    vertical-align: top;
    display: inline-block;
  }
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
