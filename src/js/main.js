//============================================================================
//Global variables stuff
//============================================================================
let Vue = require('vue');
let Vars = require('./vars.js');

var currentTopic = 0;

//============================================================================
//Functions stuff
//============================================================================

function dummy(topicID){
  if(data['comments'][i]['reply_count'] > 5){
    //add load more button
    subContainer.append($('<button>', {
      class: "loadMoreSubComments sElevation0h2 sPrimaryBg",
      text: "โหลดความเห็นย่อยเพิ่ม",
      'data-last': 5,
      'data-cid': data['comments'][i]['_id'],
      'data-c': data['comments'][i]['reply_count']
    }));
  }
}

function loadMoreSubComments(last, cid, c, callback){
  loadMoreSubCommentsAJAX(last, cid, c, function(data){
    repliesArray = [];
    for(var i=0; i<data['replies'].length; ++i){
      repliesArray.push(populateComment(data['replies'][i], true));
    }
    callback(repliesArray);
  });
}
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

$('#rightPane').on('click', '.loadMoreSubComments', function(e){
  var thisButton = $(this);
  loadMoreSubComments(thisButton.attr('data-last'),
    thisButton.attr('data-cid'), thisButton.attr('data-c'),
    function(repliesArray){
      thisButton.before(repliesArray);
      if(parseInt(thisButton.attr('data-last')) + 5 < parseInt(thisButton.attr('data-c'))){
        thisButton.attr('data-last', parseInt(thisButton.attr('data-last')) + 5);
      }else{
        thisButton.remove();
      }
    });
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

      loadTopicListAJAX(forumName, _loadMoreId, data => {
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

      loadTopicAJAX(topicId, data => {
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

      loadCommentsAJAX(topicId, data => {
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

//============================================================================
//AJAXy stuff
//============================================================================

function loadTopicListAJAX(forumName, loadMoreID=0, callback){
  if(forumName === 'all') forumName = '';
  var loadUrl = 'http://www.pantip.com/forum/' + forumName;
  if(loadMoreID !== 0){
    loadUrl += '?tid=' + loadMoreID;
  }
  $.ajax({
    url: loadUrl,
    dataType: 'text',
    success: function(data){
      var res = {};
      var topics = new Array();
      var bestTopics = new Array();

      data = data.replace(/^[^]*<!-- ### start Index ### -->([^]*)<!-- ### end Index ### -->[^]*$/, '$1');
      data = data.replace(/src=["'].*["']/g, 'src=""');

      var html = $(data, null).find('#show_topic_lists')[0];
      $(html).find('.post-item').each(function(i){
        var item = {};
        item['id'] = $(this).find('.post-item-title a').attr('href').substr(7);
        item['title'] = $(this).find('.post-item-title a').text().trim();
        item['author'] = $(this).find('.by-name').text().trim();
        item['utime'] = $(this).find('.timestamp abbr').attr('data-utime');
        item['timeFull'] = $(this).find('.timestamp abbr').attr('title');

        if($(this).find('.post-item-status-i').length !== 0){
          item['commentsNum'] = $(this).find('.post-item-status-i').first().text().trim();
        }else{
          item['commentsNum'] = "0";
        }
        topics.push(item);
      });

      var bestHtml = $(data).find('#item_pantip-best_room')[0];
      $(bestHtml).find('.best-item').each(function(i){
        var item = {};
        item['id'] = $(this).find('.post-item-title a').attr('href').substr(7);
        item['title'] = $(this).find('.post-item-title a').text().trim();

        bestTopics.push(item);
      });

      res['bestTopics'] = bestTopics;
      res['topics'] = topics;
      callback(res);
    },
    error: function(){
      console.log('loadTopicList ajax error.');
    }
  });
}

function loadTopicAJAX(topicID, callback){
  $.ajax({
    url: 'http://www.pantip.com/topic/' + topicID,
    dataType: 'text',
    success: function(data){

      data = data.replace(/src="\/images.*?"/g, 'src=""');
      var html = $(data).find('.main-post-inner')[0];
      var res = {};

      res['author'] = $(html).find('.display-post-name').text();
      res['title'] = $(html).find('.display-post-title').text();
      res['content'] = $(html).find('.display-post-story').html();
      res['utime'] = $(html).find('.display-post-timestamp abbr').attr('data-utime');
      res['timeFull'] = $(html).find('.display-post-timestamp abbr').attr('title');
      res['avatarSrc'] = $(html).find('.display-post-avatar img').attr('src');

      //tags
      res['tags'] = [];
      $(html).find('.tag-item').each(function(i){
        res['tags'][i] = $(this).text();
      });

      //reactions
      res['voteCount'] = parseInt($(html).find('.like-score').text());
      res['emotionCount'] = {
        sum: parseInt($(html).find('.emotion-score').text()),
        like: parseInt($(html).find('.emotion-choice-score:eq(1)').text()),
        laugh: parseInt($(html).find('.emotion-choice-score:eq(2)').text()),
        love: parseInt($(html).find('.emotion-choice-score:eq(3)').text()),
        impress: parseInt($(html).find('.emotion-choice-score:eq(4)').text()),
        scary: parseInt($(html).find('.emotion-choice-score:eq(5)').text()),
        surprised: parseInt($(html).find('.emotion-choice-score:eq(6)').text())
      }

      //for sorting
      res['emotions'] = [
        {name:"like", count:res['emotionCount']['like']},
        {name:"laugh", count:res['emotionCount']['laugh']},
        {name:"love", count:res['emotionCount']['love']},
        {name:"impress", count:res['emotionCount']['impress']},
        {name:"scary", count:res['emotionCount']['scary']},
        {name:"surprised", count:res['emotionCount']['surprised']}
      ];
      callback(res);
    },
    error: function(){
      console.log('loadTopicList ajax error.');
    }
  });

}

function loadCommentsAJAX(topicID, callback){
  $.ajax({
    type: 'GET',
    cache: false,
    url: 'http://pantip.com/forum/topic/render_comments?tid=' + topicID + '&param=&type=1&time=' + Math.random(),
    dataType: 'text',
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    success: function(data){
      dataJSON = JSON.parse(data);
      var res = {}
      if(dataJSON['count'] !== undefined){
        res['count'] = dataJSON['count'];
        res['comments'] = dataJSON['comments'];
      }else{
        res['count'] = 0;
        res['comments'] = [];
      }
      callback(res);
    },
    error: function(){
      console.log('loadComments ajax error.');
    }
  });
}

function loadMoreSubCommentsAJAX(last, cid, c, callback){
  $.ajax({
    type: 'GET',
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    url:'http://pantip.com/forum/topic/render_replys?last=' + last + '&cid=' + cid + '&c=' + c + '&ac=p&o=',
    success: function(data){
      dataJSON = JSON.parse(data);
      callback(dataJSON);
    }
  });
}
