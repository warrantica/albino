<template>
  <div class="comment sElevation1">
    <div class="info">
      <img class="avatar" :src="data.user.avatar.medium" />
      <div class="author" :class="{op:data.owner_topic}">{{ data.user.name }}</div>
      <div class="time sSubtitle">
        <time class="timeago" :datetime="data.utime">{{ data.data_addrtitle }}</time>
      </div>
      <div class="numContainer sSubtitle">#{{ data.comment_no }}</div>
    </div>
    <div class="content">{{{ data.message }}}</div>
    <reaction-view></reaction-view>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default(){ return {
          title: '',
          author: '',
          utime: '',
          timeFull: '',
          message: ''
        }}
      }
    },

    data(){ return {
      topEmotions: []
    }},

    ready(){
      //avatar
      if(this.data.user.avatar.medium.substr(-9, 9) === '38x38.png'){
        //unknown avatar
        this.data.user.avatar.medium = 'asset/img/default_avatar.png';
      }

      //reactions
      //this.$broadcast('loadReaction', this.data);
    }
  }
</script>
