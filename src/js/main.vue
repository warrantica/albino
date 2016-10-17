<template>
  <div id="app">
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
          <toolbar-icon icon="refresh" label="รีเฟรชรายชื่อกระทู้" @click="loadTopics(currentForum)"></toolbar-icon>
          <toolbar-icon icon="more_vert" label="อื่น ๆ" @click.stop="showDialogues.overflow = true"></toolbar-icon>
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
            <best-topic-item v-for="topic in bestTopics" :data="topic"></best-topic-item>
          </div>
        </div>
        <div id="topicListHeader"><i class="ic headerIcon">schedule</i>กระทู้ล่าสุด</div>
        <div id="topicList">
          <topic-item v-for="topic in topics" :data="topic"></topic-item>
          <button class="loadMore sButton sAccentBg sElevation0h2"
                  :data-tid="loadMoreId"
                  @click="loadMoreTopics">
            โหลดกระทู้เพิ่ม
          </button>
        </div>
      </div>
      <div class="searchPane" v-show="showSearch">
        <div class="searchContainer sForeBg">
          <toolbar-icon icon="arrow_back" label="กลับไปหน้ารายชื่อกระทู้" @click="showSearch = false"></toolbar-icon>
          <input class="searchBar" type="text" v-model="searchQuery" placeholder="คำค้นหา..." @keyup.enter="doSearch">
          <toolbar-icon icon="search" label="ค้นหา" @click="doSearch"></toolbar-icon>
        </div>
        <div class="searchResultList sForeBg">
          <div class="loading sAccentText"><i class="ic">refresh</i></div>
          <search-result-item v-for="topic in searchResults" :data="topic"></search-result-item>
          <button class="loadMore sButton sAccentBg sElevation0h2"
                  @click="loadMoreSearchResults"
                  v-show="searchResults.length">
            โหลดกระทู้เพิ่ม
          </button>
        </div>
      </div>
    </div>
    <div id="belly" class="sBackBg">
      <div id="bellyHead" class="sPrimaryBg sElevation1">
        <div class="bellyTitle">{{ currentTitle }}</div>
        <div id="bellyToolbar">
          <div class="refreshButtonContainer" @click="refreshTopic">
            <toolbar-icon icon="refresh" label="รีเฟรชกระทู้"></toolbar-icon>
            <div class="refreshBadge sAccentBg" v-show="unreadComments">{{ unreadComments }}</div>
          </div>
          <toolbar-icon icon="open_in_new" label="เปิดใน Pantip.com" @click="openInPantip"></toolbar-icon>
        </div>
      </div>
      <div id="rightPane">
        <div class="loading sAccentText"><i class="ic">hourglass_full</i></div>
        <div id="topicView" class="sForeBg sElevation1">
          <topic-view :data="topicData" v-show="currentTopic"></topic-view>
          <component :is="currentPage" v-show="!currentTopic"></component>
        </div>
        <comment-view v-show="currentTopic"></comment-view>
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
let Vars = require('./vars.js');
let Pantip = require('./pantipInterface.js');

export default {

  data(){ return{
    forums: Vars.forumInfo,
    currentForum: '',
    currentTitle: '',
    //currentTopic: 0,
    currentPage: 'tips',
    //showBestTopics: false,
    showDialogues: {
      forumSelect: false,
      overflow: false
    },
    showSearch: false,
    bestTopics: [],
    topics: [],
    searchQuery: '',
    searchQueryString: '',
    searchResults: [],
    loadMoreId: 0,
    topTopicId: 0,
    topicRefreshIntervalId: '',
    unreadComments: 0,
    topicData: {}
  }},

  computed: {
    currentTopic(){ return this.$store.state.currentTopic },

    forumDisplayName(){
      if(this.currentForum !== ''){
        for(let forum of this.forums)
          if(forum.name === this.currentForum) return forum.label;
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

    loadTopics(forumName, loadMore = false){
      let _loadMoreId = loadMore ? this.loadMoreId : 0;
      this.currentForum = forumName;
      this.showBestTopics = false;
      if(!loadMore){
        $('#leftPane').addClass('wrapUp');
        $('#leftPane .loading').addClass('active');
        this.topics = [];

        Pantip.loadBestTopics(forumName).then(data => this.bestTopics = data);
      }

      Pantip.loadTopics(forumName, _loadMoreId).then(data => {
        //console.log(data);
        $('#leftPane').removeClass('wrapUp');
        $('#leftPane .loading').removeClass('active');

        for(let topic of data['topics']){
          topic.isActive = topic._id === this.currentTopic;
          topic.isTop = topic._id === this.topTopicId;
          this.topics.push(topic);
        }
        this.topTopicId = this.topics[0]._id;
        this.loadMoreId = data.loadMoreID;
      });
    },

    loadMoreTopics(){
      this.loadTopics(this.currentForum, true);
      $('.topic.' + this.loadMoreId).addClass('beforeMore');
    },

    doSearch(){
      if(this.searchQuery === '') return false;

      $('.searchResultList').addClass('wrapUp');
      $('.searchResultList .loading').addClass('active');
      Pantip.search(this.searchQuery).then(data => {
        //console.log(data);
        this.searchResults = data.results;
        this.searchQueryString = data.queryString;
        $('.searchResultList').removeClass('wrapUp');
        $('.searchResultList .loading').removeClass('active');
      });
    },

    loadMoreSearchResults(){
      Pantip.search(this.searchQuery,
        this.searchResults.length,
        this.searchQueryString).then(data => {

        this.searchResults.push(...data.results);
      });
    },

    loadTopic(topicId){
      //pull down curtains
      $('#rightPane').addClass('wrapUp');
      $('#rightPane .loading').addClass('active');

      if(topicId !== this.currentTopic)
        $('#rightPane').animate({scrollTop:0}, "0.5s");

      return Promise.all([
        Pantip.loadTopic(topicId),
        Pantip.loadComments(topicId)
      ]).then(values => {
        //console.log(values);

        //load topic
        values[0].utime = convertTheirStupidDateTimeFormatToISO(values[0].utime);
        this.$broadcast('loadTopicView', values[0]);
        this.currentTitle = values[0]['title'];

        //load comments
        values[1].tid = topicId;
        this.$broadcast('loadCommentView', values[1], topicId === this.currentTopic);

        //pull up curtains
        $('#rightPane').removeClass('wrapUp');
        $('#rightPane .loading').removeClass('active');

        //set current topic
        this.currentTopic = topicId;

        //set up polling
        this.unreadComments = 0;
        window.clearInterval(this.topicRefreshIntervalId);
        this.topicRefreshIntervalId =  window.setInterval(() => {
          Pantip.loadComments(topicId).then(data => {
            if(data.count >= values[1].count){
              this.unreadComments = data.count - values[1].count;
            }
          });
        }, 30000);

        //show FAB
        window.setTimeout(() => {
          let rightPane = document.getElementById('rightPane');
          if(rightPane.offsetHeight < rightPane.scrollHeight){
            $('#fab').addClass('enable');
          }else{
            $('#fab').removeClass('enable');
          }
        }, 50);
      });

    },

    refreshTopic(){
      if(this.currentTopic !== 0){
        let scroll = document.getElementById('rightPane').scrollTop;
        this.loadTopic(this.currentTopic).then(value =>{
          $('#rightPane').stop().animate({scrollTop:scroll}, "0.5s");
        });
      }
    },

    loadPage(name){
      this.currentTitle = '';
      this.currentTopic = 0;
      window.clearInterval(this.topicRefreshIntervalId);
      this.unreadComments = 0;
      this.currentPage = name;
    },

    openInPantip(){
      if(this.currentTopic !== 0)
        window.open(`http://pantip.com/topic/${this.currentTopic}`, '_blank');
    },

    goToSettings(){
      chrome.runtime.openOptionsPage();
    }
  },

  events: {
    'loadForum': function(forum){
      this.loadTopics(forum);
    },

    'loadTopic': function(topicId){
      this.$broadcast('topicLoaded', topicId);
      this.loadTopic(topicId);
    },

    'loadSearchResult': function(url){
      Pantip.getTopicIdFromSearch(url).then(id => {
        this.loadTopic(id);
      });
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
      this.loadTopics(item.defaultForum);
      //this.$broadcast('applyTheme', item.theme);
      //this.$broadcast('applyFont', item.fontSize, item.fontFace);
    });
  }
}
</script>
