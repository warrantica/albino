<template>
  <div id="app" @click="dismissDialogues">
    <div id="sidebar" class="sBackBg sElevation2">
      <div id="sidebarHead" class="sForeBg">
        <div id="logo">
          <img src="asset/img/logo.png"/>
          <img src="asset/img/logoHover.png" class="logoHover"/>
        </div>
        <div class="sidebarToolbar">
          <div id="forumSelector" class="sClickable" @click.stop="showDialogues.forumSelect = true">
            <span id="forumSelectorName">{{ forumDisplayName }}</span>
            <i class="ic">arrow_drop_down</i>
          </div>
          <toolbar-icon icon="refresh" label="รีเฟรชรายชื่อกระทู้" @click.native="refreshTopics"></toolbar-icon>
          <toolbar-icon icon="more_vert" label="อื่น ๆ" @click.native.stop="showDialogues.overflow = true"></toolbar-icon>
        </div>
        <ul id="forumSelect" class="dialogue sElevation2 sClickable"
            :class="{ active:showDialogues.forumSelect }">
          <forum-select-item v-for="forum in forums" :name="forum.name">
            {{ forum.label }}
          </forum-select-item>
        </ul>
        <ul id="overflow" class="dialogue sElevation2"
            :class="{ active:showDialogues.overflow }">
          <li class="sClickable" @click="showSearch = true">ค้นหา</a></li>
          <li class="sClickable" @click="goToSettings">ตั้งค่า</a></li>
          <li class="sClickable" @click="loadPage('about')">เกี่ยวกับ Albino</li>
        </ul>
      </div>
      <div id="leftPane" class="sForeBg" v-show="!showSearch">
        <div class="loading sAccentText"><i class="ic">refresh</i></div>
        <div id="bestTopicContainer">
          <div id="bestTopicHeader" class="sClickable"
               :class="{ active: $store.state.showBestTopics }"
               @click="$store.commit('toggleBestTopics')">
            <i class="ic headerIcon">thumb_up</i>กระทู้แนะนำ<i class="ic dropdown">expand_more</i>
          </div>
          <div id="bestTopicList" :class="{ active: $store.state.showBestTopics }">
            <best-topic-item v-for="topic in $store.state.bestTopics" :data="topic"></best-topic-item>
          </div>
        </div>
        <div id="topicListHeader"><i class="ic headerIcon">schedule</i>กระทู้ล่าสุด</div>
        <div id="topicList">
          <topic-item v-for="topic in $store.state.topics" :data="topic"></topic-item>
          <button class="loadMore sButton sAccentBg sElevation0h2"
                  :data-tid="$store.state.loadMoreId"
                  @click="loadMoreTopics">
            โหลดกระทู้เพิ่ม
          </button>
        </div>
      </div>
      <div class="searchPane" v-show="showSearch">
        <div class="searchContainer sForeBg">
          <toolbar-icon icon="arrow_back" label="กลับไปหน้ารายชื่อกระทู้" @click.native="showSearch = false"></toolbar-icon>
          <input class="searchBar" type="text"
                 v-model="$store.state.searchQuery"
                 placeholder="คำค้นหา..."
                 @keyup.enter="doSearch">
          <toolbar-icon icon="search" label="ค้นหา" @click.native="doSearch"></toolbar-icon>
        </div>
        <div class="searchResultList sForeBg">
          <div class="loading sAccentText"><i class="ic">refresh</i></div>
          <search-result-item v-for="topic in $store.state.searchResults" :data="topic"></search-result-item>
          <button class="loadMore sButton sAccentBg sElevation0h2"
                  @click="loadMoreSearchResults"
                  v-show="$store.state.searchResults.length">
            โหลดกระทู้เพิ่ม
          </button>
        </div>
      </div>
    </div>
    <div id="belly" class="sBackBg">
      <div id="bellyHead" class="sPrimaryBg sElevation1">
        <div class="bellyTitle" v-text="$store.state.topicTitle"></div>
        <div id="bellyToolbar">
          <div class="refreshButtonContainer" @click="refreshTopic">
            <toolbar-icon icon="refresh" label="รีเฟรชกระทู้"></toolbar-icon>
            <div class="refreshBadge sAccentBg" v-show="$store.state.unreadComments">
              {{ $store.state.unreadComments }}
            </div>
          </div>
          <toolbar-icon icon="open_in_new" label="เปิดใน Pantip.com" @click.native="openInPantip"></toolbar-icon>
        </div>
      </div>
      <div id="rightPane">
        <div class="loading sAccentText"><i class="ic">hourglass_full</i></div>
        <div id="topicView" class="sForeBg sElevation1">
          <topic-view :data="$store.state.topicData" v-show="topicId != 0"></topic-view>
          <component :is="$store.state.pageName" v-show="topicId == 0"></component>
        </div>
        <comment-view v-show="topicId"></comment-view>
      </div>
      <div id="fab" class="disable sAccentBg sElevation4">
        <div class="topContainer sClickable"><i class="ic">expand_less</i></div>
        <div class="bottomContainer sClickable"><i class="ic">expand_more</i></div>
      </div>
    </div>
    <div id="lightBox" class="sClickable">
      <img src="" />
    </div>
  </div>
</template>

<script>
import Vars from './vars';
import Pantip from './pantipInterface';
import Helper from './helpers';

export default {

  data(){ return{
    forums: Vars.forumInfo,
    currentPage: 'tips',
    showDialogues: {
      forumSelect: false,
      overflow: false
    },
    showSearch: false,
  }},

  computed: {
    topicId(){ return this.$store.state.topicId },

    forumDisplayName(){
      if(this.currentForum !== ''){
        for(let forum of this.forums)
          if(forum.name === this.$store.state.forumName) return forum.label;
      }else{
        return 'เลือกห้อง';
      }
    }
  },

  methods: {
    dismissDialogues(){
      for(let key in this.showDialogues){
        if(this.showDialogues.hasOwnProperty(key)){
          this.showDialogues[key] = false;
        }
      }
    },

    refreshTopics(){
      this.$store.dispatch('loadTopics', {forumName: this.$store.state.forumName});
    },

    loadMoreTopics(){
      this.$store.dispatch('loadTopics', {forumName: this.$store.state.forumName, loadMore: true});
      $('.topic.' + this.$store.state.loadMoreId).addClass('beforeMore');
    },

    doSearch(){
      this.$store.dispatch('search');
    },

    loadMoreSearchResults(){
      this.$store.dispatch('search', { loadMore: true });
    },

    refreshTopic(){
      if(this.topicId !== 0){
        let scroll = document.getElementById('rightPane').scrollTop;

        this.$store.dispatch('loadTopic', this.topicId).then(value =>{
          $('#rightPane').stop().animate({scrollTop:scroll}, "0.5s");
        });
      }
    },

    loadPage(name){
      this.$store.dispatch('loadPage', name);
    },

    openInPantip(){
      if(this.$store.state.topicId !== 0)
        window.open(`http://pantip.com/topic/${this.$store.state.topicId}`, '_blank');
    },

    goToSettings(){
      chrome.runtime.openOptionsPage();
    }
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
