//============================================================================
//Browserify require stuff
//============================================================================

let Vue = require('vue');
let Vars = require('./vars.js');
let Pantip = require('./pantipInterface.js');

//============================================================================
//Event binding stuff
//============================================================================

$('#rightPane').on('click', '.spoil-btn', function(e){
  $(this).next().toggle();
});

$('#fab').on('click', '.topContainer', function(e){
  let scrollTo = 0;
  let previousTop = 0;
  $('#rightPane').find('.comment:not(.sub)').each(function(i){
    if(this.getBoundingClientRect().top >= 64){
      scrollTo = previousTop;
      return false; //break
    }
    previousTop = this.getBoundingClientRect().top;
  });
  if(scrollTo !== 0){
    $('#rightPane').stop().animate({
      scrollTop:$('#rightPane').scrollTop() + scrollTo - 64
    }, "0.5s");
  }
});

$('#fab').on('click', '.bottomContainer', function(e){
  let scrollTo = 0;
  $('#rightPane').find('.comment:not(.sub)').each(function(i){
    if(this.getBoundingClientRect().top > 64){
      scrollTo = this.getBoundingClientRect().top;
      return false; //break
    }
  });
  if(scrollTo !== 0){
    $('#rightPane').stop().animate({
      scrollTop:$('#rightPane').scrollTop() + scrollTo - 64
    }, "0.5s");
  }
});

$('#rightPane').on('click', '.img-in-post', function(e){
  $(this).addClass('inLightBox');
  $('#lightBox').addClass('active');

  let dimensions = this.getBoundingClientRect();
  $('#lightBox img').attr('src', $(this).attr('src')).css({
    'top':dimensions.top,
    'left':dimensions.left,
    'max-width':dimensions.width,
    'max-height':dimensions.height
  });
  window.setTimeout(function(){
    $('#lightBox img').css({
      'top':'',
      'left':'',
      'max-width':'99%',
      'max-height':'99vh'
    }).addClass('active');
  }, 50);
});

$('#lightBox').on('click', function(e){
  $(this).removeClass('active');
  window.setTimeout(function(){
    $('#lightBox img').removeClass('active').removeAttr('style').removeAttr('src');
  }, 250);
  $('#rightPane .img-in-post').removeClass('inLightBox');
});

/*===========================================================================

        V888     888
        888     888
        888     888
        Y88b   d88P 888  888  .d88b.
         Y88b d88P  888  888 d8P  Y8b
          Y88o88P   888  888 88888888
           Y888P    Y88b 888 Y8b.
            Y8P      "Y88888  "Y8888

===========================================================================*/

Vue.component('toolbarIcon', require('./components/toolbarIcon.vue'));
Vue.component('forumSelectItem', require('./components/forumSelectItem.vue'));
Vue.component('bestTopicItem', require('./components/bestTopicItem.vue'));
Vue.component('topicItem', require('./components/topicItem.vue'));
Vue.component('searchResultItem', require('./components/searchResultItem.vue'));
Vue.component('topicView', require('./components/topicView.vue'));
Vue.component('commentView', require('./components/commentView.vue'));
Vue.component('pagination', require('./components/pagination.vue'));
Vue.component('commentItem', require('./components/commentItem.vue'));
Vue.component('reactionView', require('./components/reactionView.vue'));
//Vue.component('themeStyle', require('./components/themeStyle.vue'));
Vue.component('tips', require('./pages/tipsPage.vue'));
Vue.component('about', require('./pages/aboutPage.vue'));

let vm = new Vue({
  el: 'body',

  data(){ return{
    forums: Vars.forumInfo,
    currentForum: '',
    currentTitle: '',
    currentTopic: 0,
    currentPage: 'tips',
    showBestTopics: false,
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
    unreadComments: 0
  }},

  computed: {
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
      this.$broadcast('applyTheme', item.theme);
      this.$broadcast('applyFont', item.fontSize, item.fontFace);
    });
  }
});

//============================================================================
//Utility function stuff
//============================================================================

function convertTheirStupidDateTimeFormatToISO(utime){
  //utime format: mm/dd/yyyy hh:mm:ss
  let y = utime.substr(6, 4);
  let m = utime.substr(0, 2);
  let d = utime.substr(3, 2);
  let t = utime.substr(11, 8);
  return y+'-'+m+'-'+d+'T'+t;
}

chrome.storage.onChanged.addListener(changes => {
  console.log(changes);
  if(changes.theme !== undefined){
    vm.$broadcast('applyTheme', changes.theme.newValue);
  }
});
