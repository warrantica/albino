//============================================================================
//Browserify require stuff
//============================================================================

let Vue = require('vue');
let Vuex = require('vuex');

Vue.use(Vuex);

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

//============================================================================
//Vuex
//============================================================================

let store = new Vuex.Store({
  state: {
    showBestTopics: false,
    currentTopic: 0,
    topicTitle: '',
    topicData: {},
    topicRefreshIntervalId: 0
  },

  mutations: {
    toggleBestTopics(state){
      state.showBestTopics = ! state.showBestTopics;
    },

    setTopicTitle(state, title){
      state.topicTitle = title;
    }
  },

  actions: {
    loadTopicFromId({ dispatch, commit, state }, topicId){
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
        dispatch('loadTopic', values[0]);
        commit('setTopicTitle', values[0]['title']);

        //load comments
        values[1].tid = topicId;
        //this.$broadcast('loadCommentView', values[1], topicId === this.currentTopic);

        //pull up curtains
        $('#rightPane').removeClass('wrapUp');
        $('#rightPane .loading').removeClass('active');

        //set current topic
        state.currentTopic = topicId;

        //set up polling
        //this.unreadComments = 0;
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


    loadTopic({ commit, state }, data){
      //sanitising content
      let content = $('<div>').append(data.content);
      //no eval for you!
      $(content).find('script').remove();
      $(content).find('.review-section').remove();
      $(content).find('.edit-history').remove();
      //no polls for you!
      $(content).find('.q-poll').remove();
      $(content).find('.button-container').remove();
      data.content = content.html();

      //avatar
      if(data.avatarSrc === ''){
        //unknown avatar
        data.avatarSrc = 'asset/img/default_avatar.png';
      }

      //tags
      if(data.tags.length > 0) data.tags = data.tags.join(', ');

      state.topicData = data;

      //reactions
      let reactionData = {
        voteSum: data.voteCount,
        emotionSum: data.emotionCount.sum,
        emotionCounts: data.emotionCount,
        emotionSortable: data.emotions
      };
      //this.$broadcast('loadReaction', reactionData);
      $('time.timeago').timeago();
    }
  }
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

let App = require('./main.vue');

let vm = new Vue({
  store,
  render: h => h(App)
}).$mount('#app');

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
