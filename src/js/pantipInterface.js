module.exports = {
  loadTopics(forumName, loadMoreID=0, callback){
    console.log("From another module!");
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
  },

  loadTopic(topicID, callback){
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

  },

  loadComments(topicID, callback){
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
  },

  loadMoreSubComments(last, cid, c, callback){
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
}
