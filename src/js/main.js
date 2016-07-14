let forumInfo = require('vars.js');

//============================================================================
//Global variables stuff
//============================================================================
var rootURL = chrome.extension.getURL('');
var bestTopicTemplate = $('<div>', {class: "topic sClickable"});
bestTopicTemplate.load(rootURL + 'template/bestTopicTemplate.html');
var topicTemplate = $('<div>', {class: "topic sClickable"});
topicTemplate.load(rootURL + 'template/topicTemplate.html');
var viewTopicTemplate = $('<div>', {class: "topicWrapper"});
viewTopicTemplate.load(rootURL + 'template/viewTopicTemplate.html');
var commentTemplate = $('<div>', {class: "comment sElevation1"});
commentTemplate.load(rootURL + 'template/commentTemplate.html');

var lastTopicID = 0;

var currentForum = 'sinthorn'; //default here
var currentTopic = 0;

//============================================================================
//Functions stuff
//============================================================================

function loadTopicList(forumName, loadMoreID=0){
  currentForum = forumName;

  var topicsJSON;

  if(loadMoreID === 0){
    $('#leftPane').addClass('wrapUp');
    $('#leftPane .loading').addClass('active');
  }

  loadTopicListAJAX(forumName, loadMoreID, function(data){
    populateTopicList(data, loadMoreID);

    $('#forumSelectorName').text(forumInfo[forumName]);
    $('time.timeago').timeago();
  });
}

function populateTopicList(data, loadMoreID=0){
  console.log(data);
  $('#leftPane').removeClass('wrapUp');
  $('#leftPane .loading').removeClass('active');

  if(loadMoreID === 0){
    $('#bestTopicList').html('');
    $('#topicList').html('');

    var bestTopicEach;
    for(var i=0; i<data['bestTopics'].length; ++i){
      bestTopicEach = bestTopicTemplate.clone();

      bestTopicEach.attr('data-id', data['bestTopics'][i]['id']);
      bestTopicEach.find('.title').text(data['bestTopics'][i]['title']);

      $('#bestTopicList').append(bestTopicEach);
    }
  }

  var topicEach;
  for(var i=0; i<data['topics'].length; ++i){
    topicEach = topicTemplate.clone();

    topicEach.attr('data-id', data['topics'][i]['id']);
    topicEach.addClass(data['topics'][i]['id']);
    topicEach.find('.title').text(data['topics'][i]['title']);
    topicEach.find('.author').text(data['topics'][i]['author']);
    topicEach.find('time').text(data['topics'][i]['timeFull']);
    topicEach.find('time').attr('datetime', data['topics'][i]['utime']);
    topicEach.find('.commentsNum').text(data['topics'][i]['commentsNum']);

    if(data['topics'][i]['commentsNum'] == '0'){
      topicEach.find('.subtitle .ic').text('chat_bubble_outline');
    }

    if(data['topics'][i]['id'] == lastTopicID) topicEach.addClass('lastTopic');

    $('#topicList').append(topicEach);
  }

  lastTopicID = data['topics'][0]['id'];

  //append loadMore button
  $('#topicList').append($('<button>', {
    class:"loadMore sPrimaryBg sElevation0h2",
    text:"โหลดกระทู้เพิ่ม",
    "data-tid":data['topics'][data['topics'].length - 1]['id']
  }));
}

function loadTopic(topicID){
  $('#rightPane').addClass('wrapUp');
  $('#rightPane .loading').addClass('active');

  loadTopicAJAX(topicID, function(data){
    var topicWrapperClone = viewTopicTemplate.clone();

    topicWrapperClone.find('.title').text(data['title']);
    topicWrapperClone.find('.author').text(data['author']);

    //time
    topicWrapperClone.find('.timeago').text(data['timeFull']);
    topicWrapperClone.find('.timeago').attr('datetime', convertTheirStupidDateTimeFormatToISO(data['utime']));

    //sanitising content
    var content = $('<div>').append(data['content']);
    //no eval for you!
    $(content).find('script').remove();
    $(content).find('.review-section').remove();
    $(content).find('.edit-history').remove();
    //no polls for you!
    $(content).find('.q-poll').remove();
    $(content).find('.button-container').remove();

    topicWrapperClone.find('.content').html(content.html());

    //avatar
    if(data['avatarSrc'].substr(-9,9) === "38x38.png"){
      //unknown avatar
      topicWrapperClone.find('.avatar').attr('src', rootURL + 'asset/img/default_avatar.png');
    }else{
      topicWrapperClone.find('.avatar').attr('src', data['avatarSrc']);
    }

    //tags
    if(data['tags'].length > 0){
      topicWrapperClone.find('.tag').append(data['tags'].join(', '));
    }else{
      topicWrapperClone.find('.tag').addClass('empty');
    }

    //reactions
    if(data['voteCount'] > 0 || data['emotionCount'] > 0){
      topicWrapperClone.find('.voteCount').text(data['voteCount']);

      data['emotions'].sort(function(a,b){
        return (a.count>b.count) ? -1 : ((a.count<b.count) ? 1 : 0);
      });

      topicWrapperClone.find('.emotionIcons').append($('<img />', {src: rootURL + '/asset/img/emotions/' + data['emotions'][0].name + '.png'}));
      if(data['emotions'][1].count > 0)
        topicWrapperClone.find('.emotionIcons').append($('<img />', {src: rootURL + '/asset/img/emotions/' + data['emotions'][1].name + '.png'}));
      if(data['emotions'][2].count > 0)
        topicWrapperClone.find('.emotionIcons').append($('<img />', {src: rootURL + '/asset/img/emotions/' + data['emotions'][2].name + '.png'}));

      topicWrapperClone.find('.emotionCount').text(data['emotionCount']['sum']);
      topicWrapperClone.find('.likeCount').text(data['emotionCount']['like']);
      topicWrapperClone.find('.laughCount').text(data['emotionCount']['laugh']);
      topicWrapperClone.find('.loveCount').text(data['emotionCount']['love']);
      topicWrapperClone.find('.impressCount').text(data['emotionCount']['impress']);
      topicWrapperClone.find('.scaryCount').text(data['emotionCount']['scary']);
      topicWrapperClone.find('.surprisedCount').text(data['emotionCount']['surprised']);
    }else{
      topicWrapperClone.find('.reactions').addClass('empty');
    }

    $('#topicView').html(topicWrapperClone);
    $('#bellyTitle').text(data['title']);

    loadComments(topicID);
  });

  $('#rightPane').animate({scrollTop:0}, "0.5s");
}

function loadComments(topicID){
  loadCommentsAJAX(topicID, function(data){
    console.log(data);
    var commentEach;

    $('#commentsView').html('');
    for(var i=0; i<data['comments'].length; ++i){
      var commentEach = populateComment(data['comments'][i]);

      if(data['comments'][i]['replies'].length > 0){
        var subContainer = $('<div>', {class: "subContainer"});
        for(var j=0; j<data['comments'][i]['replies'].length; ++j)
          subContainer.append(populateComment(data['comments'][i]['replies'][j], true));

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
        commentEach.append(subContainer);
      }

      $('#commentsView').append(commentEach);
    }

    if(document.getElementById('rightPane').offsetHeight < document.getElementById('rightPane').scrollHeight){
      $('#fab').addClass('enable');
    }else{
      $('#fab').removeClass('enable');
    }
    $('#rightPane').removeClass('wrapUp');
    $('#rightPane .loading').removeClass('active');
    $('time.timeago').timeago();
    currentTopic = topicID;
  });
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

function populateComment(data, subComment = false){
  commentEach = commentTemplate.clone();

  //basic info
  commentEach.find('.content').html(data['message']);
  commentEach.find('.author').html(data['user']['name']);

  //time
  commentEach.find('.timeago').text(data['data_addrtitle']);
  commentEach.find('.timeago').attr('datetime', convertTheirStupidDateTimeFormatToISO(data['data_utime']));

  //comment number, other differences
  if(subComment){
    commentEach.find('.num').text(data['comment_no']+ '-' + data['reply_no']);
    commentEach.addClass('sub');
  }else{
    commentEach.find('.num').text(data['comment_no']);
  }

  //if OP
  if(data['owner_topic'] === true){
    commentEach.find('.author').addClass('op');
  }

  //avatar
  if(data['user']['avatar']['medium'].substr(-9,9) === "38x38.png"){
    //unknown avatar, placeholder for now
    commentEach.find('.avatar').attr('src', rootURL + 'asset/img/default_avatar.png');
  }else{
    commentEach.find('.avatar').attr('src', data['user']['avatar']['medium']);
  }

  //emotions/reactions
  if(data['emotion']['sum'] > 0 || data['good_bad_vote']['point'] > 0){

    //vote
    commentEach.find('.voteCount').text(data['good_bad_vote']['point']);

    //emotions
    var emotions = [
      {name:"impress", count:data['emotion']['impress']['count']},
      {name:"laugh", count:data['emotion']['laugh']['count']},
      {name:"like", count:data['emotion']['like']['count']},
      {name:"love", count:data['emotion']['love']['count']},
      {name:"scary", count:data['emotion']['scary']['count']},
      {name:"surprised", count:data['emotion']['surprised']['count']}
    ];

    emotions.sort(function(a,b){
      return (a.count>b.count) ? -1 : ((a.count<b.count) ? 1 : 0);
    });

    commentEach.find('.emotionIcons').append($('<img />', {src: rootURL + '/asset/img/emotions/' + emotions[0].name + '.png'}));
    if(emotions[1].count > 0)
      commentEach.find('.emotionIcons').append($('<img />', {src: rootURL + '/asset/img/emotions/' + emotions[1].name + '.png'}));
    if(emotions[2].count > 0)
      commentEach.find('.emotionIcons').append($('<img />', {src: rootURL + '/asset/img/emotions/' + emotions[2].name + '.png'}));

    commentEach.find('.emotionCount').text(data['emotion']['sum']);
    commentEach.find('.likeCount').text(data['emotion']['like']['count']);
    commentEach.find('.laughCount').text(data['emotion']['laugh']['count']);
    commentEach.find('.loveCount').text(data['emotion']['love']['count']);
    commentEach.find('.impressCount').text(data['emotion']['impress']['count']);
    commentEach.find('.scaryCount').text(data['emotion']['scary']['count']);
    commentEach.find('.surprisedCount').text(data['emotion']['surprised']['count']);
  }else{
    commentEach.find('.reactions').addClass('empty');
  }

  return commentEach;
}

//============================================================================
//Event binding stuff
//============================================================================

$('#leftPane').on('click', '.topic', function(e){
  $('.topic').removeClass('active');
  $(this).addClass('active');

  loadTopic($(this).data('id'));
  //loadTopic('35219493');
});

$('#leftPane').on('click', '.loadMore', function(e){
  loadTopicList(currentForum, $(this).data('tid'));
  $(this).remove(); //maybe make it more elegant
  $('.topic.' + $(this).data('tid')).addClass('beforeMore');
});

$('#sidebar .refreshButton').on('click', function(e){
  loadTopicList(currentForum);
});

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
Vue.component('forumSelectItem', forumSelectItem);

let vm = new Vue({
  el: 'body',

  data(){ return{
    forums: forumInfo,
    currentForum: 'all',
    showBestTopics: false,
    showDialogues: {
      forumSelect: false
    }
  }},

  methods: {
    dismissDialogues(){
      for(let key in this.showDialogues){
        if(this.showDialogues.hasOwnProperty(key)){
          this.showDialogues[key] = false;
        }
      }
    }
  },

  events: {
    'loadForum': forum => {
      loadTopicList(forum);
    }
  },

  ready(){
    loadTopicList(currentForum);
    $('time.timeago').timeago();

    //Get and apply options
    chrome.storage.sync.get({
      theme: 'default'
    }, function(item){
      $('body').addClass(item.theme);
    });
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

      var html = $(data).find('#show_topic_lists')[0];
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
