//============================================================================
//Global variables stuff
//============================================================================

let Vue = require('vue');
let Vars = require('./vars.js');
let Pantip = require('./pantipInterface.js');

var currentTopic = 0;

//============================================================================
//Event binding stuff
//============================================================================

$('#belly .refreshButton').on('click', function(e){
  if(currentTopic !== 0)
    loadTopic(currentTopic);
});

$('#belly .openInPantipButton').on('click', function(e){
  if(currentTopic !== 0)
    window.open('http://pantip.com/topic/' + currentTopic, '_blank');
});

$('#rightPane').on('click', '.spoil-btn', function(e){
  $(this).next().toggle();
});

$('#fab').on('click', '.topContainer', function(e){
  var scrollTo = 0;
  var previousTop = 0;
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
  var scrollTo = 0;
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

  var dimensions = this.getBoundingClientRect();
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

let forumSelectItem = require('./components/forumSelectItem.vue');
let bestTopicItem = require('./components/bestTopicItem.vue');
let topicItem = require('./components/topicItem.vue');
let topicView = require('./components/topicView.vue');
let commentView = require('./components/commentView.vue');
let commentItem = require('./components/commentItem.vue');
let reactionView = require('./components/reactionView.vue');

Vue.component('forumSelectItem', forumSelectItem);
Vue.component('bestTopicItem', bestTopicItem);
Vue.component('topicItem', topicItem);
Vue.component('topicView', topicView);
Vue.component('commentView', commentView);
Vue.component('commentItem', commentItem);
Vue.component('reactionView', reactionView);

let vm = new Vue({
  el: 'body',

  data(){ return{
    forums: Vars.forumInfo,
    currentForum: '',
    showBestTopics: false,
    showDialogues: {
      forumSelect: false
    },
    bestTopics: [],
    topics: [],
    loadMoreId: 0,
    test: ''
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
      if(!loadMore){
        $('#leftPane').addClass('wrapUp');
        $('#leftPane .loading').addClass('active');
      }

      Pantip.loadTopics(forumName, _loadMoreId, data => {
        //console.log(data);
        $('#leftPane').removeClass('wrapUp');
        $('#leftPane .loading').removeClass('active');

        if(!loadMore){
          this.topics = [];
          this.bestTopics = data['bestTopics'];
        }

        this.topics.push(...data['topics']);
        this.loadMoreId = data['topics'][data['topics'].length - 1]['id'];
      });
    },

    loadMoreTopics(){
      this.loadTopics(this.currentForum, true);
      $('.topic.' + this.loadMoreId).addClass('beforeMore');
    },

    loadTopic(topicId){
      $('#rightPane').addClass('wrapUp');
      $('#rightPane .loading').addClass('active');
      $('#rightPane').animate({scrollTop:0}, "0.5s");

      Pantip.loadTopic(topicId, data => {
        data.utime = convertTheirStupidDateTimeFormatToISO(data.utime);
        this.$broadcast('loadTopicView', data);

        $('#bellyTitle').text(data['title']);

        //loadComments(topicId);
        if(document.getElementById('rightPane').offsetHeight < document.getElementById('rightPane').scrollHeight){
          $('#fab').addClass('enable');
        }else{
          $('#fab').removeClass('enable');
        }
        $('#rightPane').removeClass('wrapUp');
        $('#rightPane .loading').removeClass('active');
      });

      Pantip.loadComments(topicId, data => {
        console.log(data);
        this.$broadcast('loadCommentView', data);
      });
    }
  },

  events: {
    'loadForum': function(forum){
      this.loadTopics(forum);
    },

    'loadTopic': function(topicId){
      this.$broadcast('topicLoaded', topicId);
      this.loadTopic(topicId);
    }
  },

  ready(){
    //Get and apply options
    chrome.storage.sync.get({
      theme: 'default',
      defaultForum: ''
    }, item => {
      $('body').addClass(item.theme);
      this.loadTopics(item.defaultForum);
    });


    /*$.ajax({
      type: 'POST',
      url: 'http://pantip.com/forum/topic/best_answer',
      data: {
        tid: 35381062,
        cid: 60829529
      },
      headers: {'X-Requested-With': 'XMLHttpRequest'},
      success: function(data){
        //vm.test = JSON.parse(data);
        console.log(data);
      }
    });*/
  }
});

//============================================================================
//Utility function stuff
//============================================================================

function convertTheirStupidDateTimeFormatToISO(utime){
  //utime format: mm/dd/yyyy hh:mm:ss
  var y = utime.substr(6, 4);
  var m = utime.substr(0, 2);
  var d = utime.substr(3, 2);
  var t = utime.substr(11, 8);
  return y+'-'+m+'-'+d+'T'+t;
}
