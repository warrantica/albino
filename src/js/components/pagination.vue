<template>
<div class="pagination" v-show="totalPages > 1">
  <i class="ic sClickable" @click="goToPage(currentPage-1)">chevron_left</i>
  <span class="page sClickable"
        v-for="page in totalPages"
        :class="{ sAccentBg: page==currentPage, current: page==currentPage }"
        @click="goToPage(page)">
    {{ page+1 }}
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
    props: {
      commentsPerPage: Number
    },

    data(){ return {
      count: 0,
      currentPage: 0,
      loadedPage: 1
    }},

    computed: {
      totalPages(){
        return Math.ceil(this.count/this.commentsPerPage);
      }
    },

    methods: {
      goToPage(pageNumber){
        this.currentPage = pageNumber;
        this.$dispatch('goToPage', pageNumber);
      }
    },

    events: {
      'setCount'(count){
        this.count = count;
      },

      'setCurrentPage'(pageNumber){
        this.currentPage = pageNumber;
      }
    }
  }
</script>
