<template>
  <div class="app" @click="dismissDialogues">
    <div class="sidebar">
      <div class="sidebarHead">
        <div class="logo">
          <img src="asset/img/logo.png"/>
          <img src="asset/img/logoHover.png" class="logo-colored"/>
        </div>
        <div class="sidebarToolbar">
          <div class="forumSelector" @click.stop="showDialogue('forumSelect')">
            <span class="forumSelector-name">{{ forumDisplayName }}</span>
            <i class="ic">arrow_drop_down</i>
          </div>
          <toolbar-icon icon="refresh" label="รีเฟรชรายชื่อกระทู้" @click.native="refreshTopics"></toolbar-icon>
          <toolbar-icon icon="more_vert" label="อื่น ๆ" @click.native.stop="showDialogue('overflow')"></toolbar-icon>
        </div>
        <ul class="dialogue dialogue--forumSelect"
            :class="{ 'dialogue--active':showDialogues.forumSelect }">
          <forum-select-item v-for="forum in forums" :name="forum.name">
            {{ forum.label }}
          </forum-select-item>
        </ul>
        <ul class="dialogue dialogue--overflow"
            :class="{ 'dialogue--active':showDialogues.overflow }">
          <li class="dialogue-item" @click="showSearch = true">ค้นหา</a></li>
          <li class="dialogue-item" @click="goToSettings">ตั้งค่า</a></li>
          <li class="dialogue-item" @click="loadPage('about')">เกี่ยวกับ Albino</li>
        </ul>
      </div>
      <div class="leftPane" v-show="!showSearch">
        <div class="loading loading--left"><i class="ics">refresh</i></div>
        <div class="curationsContainer">
          <div class="topicHeader topicHeader--curations"
               @click="$store.commit('toggleBestTopics')">
            <i class="ic topicHeader-icon">thumb_up</i>
            กระทู้แนะนำ
            <i class="ic topicHeader-dropdownIcon"
               :class="{ 'topicHeader-dropdownIcon--active': showBestTopics }">
              expand_more</i>
          </div>
          <div class="topicList topicList--curations"
               :class="{ 'topicList--showCurations': showBestTopics }">
            <curation-item v-for="topic in curations.best" :data="topic"></curation-item>
          </div>
        </div>
        <div class="curationsContainer">
          <div class="topicHeader topicHeader--curations"
               @click="$store.commit('toggleTrendTopics')">
            <i class="ic topicHeader-icon">whatshot</i>
            กระทู้ยอดนิยม
            <i class="ic topicHeader-dropdownIcon"
               :class="{ 'topicHeader-dropdownIcon--active': showTrendTopics }">
              expand_more</i>
          </div>
          <div class="topicList topicList--curations"
               :class="{ 'topicList--showCurations': showTrendTopics }">
            <curation-item v-for="topic in curations.trend" :data="topic"></curation-item>
          </div>
        </div>
        <div class="topicHeader"><i class="ic topicHeader-icon">schedule</i>กระทู้ล่าสุด</div>
        <div class="topicList">
          <topic-item v-for="topic in topics" :data="topic"></topic-item>
          <button class="topicList-loadMore"
                  @click="loadMoreTopics">โหลดกระทู้เพิ่ม</button>
        </div>
      </div>
      <div class="searchPane" v-show="showSearch">
        <div class="searchHeader">
          <toolbar-icon icon="arrow_back" label="กลับไปหน้ารายชื่อกระทู้" @click.native="showSearch = false"></toolbar-icon>
          <input class="searchHeader-input" type="text"
                 v-model="searchQuery"
                 placeholder="คำค้นหา..."
                 @keyup.enter="search">
          <toolbar-icon icon="search" label="ค้นหา" @click.native="search"></toolbar-icon>
        </div>
        <div class="searchResultList">
          <div class="loading loading--search"><i class="ics">refresh</i></div>
          <search-result-item v-for="topic in searchResults" :data="topic"></search-result-item>
          <button class="searchResultList-loadMore"
                  @click="loadMoreSearchResults"
                  v-show="searchResults.length">
            โหลดกระทู้เพิ่ม
          </button>
        </div>
      </div>
    </div>
    <div class="belly">
      <div class="bellyBar">
        <div class="bellyBar-title" v-text="topicTitle"></div>
        <div class="bellyBar-controls">
          <div class="bellyBar-refresh" @click="refreshTopic">
            <toolbar-icon icon="refresh" label="รีเฟรชกระทู้"></toolbar-icon>
            <div class="bellyBar-refreshBadge" v-show="unreadComments">
              {{ unreadComments }}
            </div>
          </div>
          <toolbar-icon icon="open_in_new" label="เปิดใน Pantip.com" @click.native="openInPantip"></toolbar-icon>
        </div>
      </div>
      <div class="rightPane">
        <div class="loading loading--right"><i class="ics">hourglass_full</i></div>
        <div class="topicContainer">
          <topic-view :data="topicData" v-show="topicId != 0"></topic-view>
          <component :is="pageName" v-show="topicId == 0"></component>
        </div>
        <comment-view v-show="topicId"></comment-view>
      </div>
      <div class="fab">
        <div class="fab-button fab-button--up"><i class="ics">expand_more</i></div>
        <div class="fab-button fab-button--down"><i class="ics">expand_more</i></div>
      </div>
    </div>
    <div class="lightBox">
      <img src="" class="lightBox-img"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Vars from './vars';
import Pantip from './pantipInterface';
import Helper from './helpers';

export default {

  data(){ return{
    forums: Vars.forumInfo,
    currentPage: 'tips',
    showSearch: false,
  }},

  computed: {
    forumDisplayName(){
      if(this.currentForum !== ''){
        for(let forum of this.forums)
          if(forum.name === this.forumName) return forum.label;
      }else{ return 'เลือกห้อง'; }
    },

    searchQuery: {
      get(){ return this.$store.state.searchQuery; },
      set(value){ this.$store.commit('setSearchQuery', value); }
    },

    ...mapState([
      'showDialogues',
      'showBestTopics',
      'showTrendTopics',
      'topicId',
      'curations',
      'topics',
      'searchResults',
      'topicTitle',
      'unreadComments',
      'topicData',
      'pageName',
      'loadMoreId',
      'forumName'
    ])
  },

  methods: {
    refreshTopics(){
      this.$store.dispatch('loadTopics', {forumName: this.forumName});
    },

    loadMoreTopics(){
      this.$store.dispatch('loadTopics', {forumName: this.forumName, loadMore: true});
      $('.topicItem.' + this.loadMoreId).addClass('topicItem--beforeMore');
    },

    loadMoreSearchResults(){
      this.$store.dispatch('search', { loadMore: true });
    },

    refreshTopic(){
      if(this.topicId !== 0){
        let scroll = document.querySelector('.rightPane').scrollTop;

        this.$store.dispatch('loadTopic', this.topicId).then(value =>{
          $('.rightPane').stop().animate({scrollTop:scroll}, "0.5s");
        });
      }
    },

    openInPantip(){
      if(this.$store.state.topicId !== 0)
        window.open(`http://pantip.com/topic/${this.topicId}`, '_blank');
    },

    goToSettings(){
      chrome.runtime.openOptionsPage();
    },

    ...mapActions([
      'dismissDialogues',
      'showDialogue',
      'search',
      'loadPage'
    ]),
  },

  mounted(){
    //Get and apply options
    chrome.storage.sync.get({
      theme: 'default',
      defaultForum: '',
      fontSize: '26',
      fontFace: 'TH Sarabun New'
    }, item => {
      this.$store.dispatch('loadTopics', {forumName: item.defaultForum});
      Helper.applyTheme(item.theme, item.fontSize, item.fontFace);
      this.$store.dispatch('loadPage', 'tips');
    });
  }
}
</script>
