<template>
<div class="pagination" v-show="totalPages > 1">
  <i class="ics pagination-arrow" @click="goToPage(currentPage-1)">chevron_left</i>
  <div class="pagination-page"
        v-for="page in totalPages"
        :class="{ 'pagination-page--current': page==currentPage+1 }"
        @click="goToPage(page-1)">{{ page }}</div>
  <i class="ics pagination-arrow" @click="goToPage(currentPage+1)">chevron_right</i>
</div>
</template>

<script>
export default {
  computed: {
    totalPages(){
      return Math.ceil(this.$store.state.totalComments/this.$store.state.commentsPerPage);
    },

    currentPage(){ return this.$store.state.commentPage }
  },

  methods: {
    goToPage(pageNum){ this.$store.dispatch('goToCommentPage', pageNum); }
  }
}
</script>
