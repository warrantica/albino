<template>
<div class="pagination" v-show="totalPages > 1">
  <i class="ic sClickable" @click="goToPage(currentPage-1)">chevron_left</i>
  <span class="page sClickable"
        v-for="page in totalPages"
        :class="{ sAccentBg: page==currentPage+1, current: page==currentPage+1 }"
        @click="goToPage(page-1)">
    {{ page }}
  </span>
  <i class="ic sClickable" @click="goToPage(currentPage+1)">chevron_right</i>
</div>
</template>

<style scoped>
  .pagination{
    width: 100%;
    text-align: center;
  }

  .page{
    display: inline-block;
    width: 18px;
    line-height: 18px;
    padding: 5px;
    margin: 5px;
    border-radius: 50%;
    transition: all .2s ease;
  }
</style>

<script>
  export default {
    computed: {
      totalPages(){
        return Math.ceil(this.$store.state.totalComments/this.$store.state.commentsPerPage);
      },

      currentPage(){ return this.$store.state.commentPage }
    },

    methods: {
      goToPage(pageNumber){
        this.$store.dispatch('goToCommentPage', pageNumber);
      }
    }
  }
</script>
