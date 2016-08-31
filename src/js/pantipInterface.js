module.exports = {
  loadBestTopics(forumName){
    if(forumName === 'all') forumName = '';
    var loadUrl = 'http://www.pantip.com/forum/' + forumName;

    return new Promise((resolve, reject) => {
      $.ajax({
        url: loadUrl,
        dataType: 'text',
        success: function(data){
          let bestTopics = new Array();

          data = data.replace(/^[^]*<!-- ### start Index ### -->([^]*)<!-- ### end Index ### -->[^]*$/, '$1');
          data = data.replace(/src=["'].*["']/g, 'src=""');
          let bestHtml = $(data).find('#item_pantip-best_room')[0];

          $(bestHtml).find('.best-item').each(function(i){
            let item = {};
            item['_id'] = $(this).find('.post-item-title a').attr('href').substr(7);
            item['disp_topic'] = $(this).find('.post-item-title a').text().trim();

            bestTopics.push(item);
          });
          resolve(bestTopics);
        },
        error: function(){
          console.log('loadTopicList ajax error.');
        }
      });
    });

  },

  loadTopics(forumName, loadMoreID=0){
    if(forumName === 'all') forumName = '';
    var loadUrl = 'http://pantip.com/forum/topic/ajax_json_all_topic_info_loadmore?t=' + Math.random();
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'post',
        url: loadUrl,
        data: {
          last_id_current_page: loadMoreID,
          dataSend: { room: forumName, topic_type: {type: 0, default_type: 1} },
          thumbnailview: false,
          current_page: 2
        },
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        dataType: 'text',
        success: function(data){
          data = JSON.parse(data).item;
          var res = { topics: [] };
          res.topics = data.topic;
          res.loadMoreID = data.last_id_current_page;
          resolve(res);
        },
        error: function(){
          console.log('loadTopicList ajax error.');
        }
      });
    });

  },

  search(query, f='', queryString=''){
    return new Promise((resolve, reject) => {
      if(query === '') reject('Empty search string');

      let url = 'http://search.pantip.com/ss?q=' + query;
      if(queryString !== '') url += '&f=' + f + '&y=' + queryString;

      $.ajax({
        type: 'GET',
        url: url,
        success: function(data){
          let queryString = data.replace(/^[^]*&y=([^]*?)"[^]*$/, '$1');
          let resData = data.replace(/^[^]*(<td style="bo[^]*?<\/td>)[^]*$/, '$1');
          let htmlLines = $(resData).find('p')[0].innerHTML.split('\n');

          let res = [];

          for(let i=0; i<htmlLines.length; ++i){
            if(htmlLines[i].endsWith(':&nbsp;')){
              let comment_num = '0';
              let content = '';
              let author = '';

              let topicHtml = $(htmlLines[i+1]);
              let disp_topic = topicHtml.text().trim();
              let topic_link = topicHtml.first().attr('href');

              if(htmlLines[i+2].startsWith('<a')){
                comment_num = $(htmlLines[i+2]).text().substr(1);
                content = htmlLines[i+3];
                author = htmlLines[i+4];
              }else{
                content = htmlLines[i+2];
                author = htmlLines[i+3];
              }
              content = $(content).html();
              author = author.replace(/^[^]*<strong>([^]*)<\/strong>[^]*$/, '$1');
              res.push({ disp_topic, topic_link, comment_num, content, author });
            }
          }

          resolve({
            results: res,
            queryString: queryString
          });
        }
      });
    });
  },

  getTopicIdFromSearch(url){
    return new Promise((resolve, reject) => {
      let res = '';
      let xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://search.pantip.com' + url, true);

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
          res = xhr.responseURL.split('/');
          resolve(res[res.length-1]);
        }else if(xhr.readyState == 4){
          reject('Error: getTopicIdFromSearch XHR failed');
        }
      }
      xhr.send(null);
    });
  },

  loadTopic(topicID){
    return new Promise((resolve, reject) => {
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
          resolve(res)
        },
        error: function(){
          console.log('loadTopicList ajax error.');
        }
      });
    });

  },

  loadComments(topicID, page=0){
    return new Promise((resolve, reject) => {
      let url = 'http://pantip.com/forum/topic/render_comments?tid=' + topicID + '&type=1&time=' + Math.random() + '&param=';
      if(page !== 0) url += 'page' + page + '&page=' + page + '&parent=2&expand=1';

      $.ajax({
        type: 'GET',
        cache: false,
        url: url,
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
          resolve(res);
        },
        error: function(){
          console.log('loadComments ajax error.');
        }
      });
    });

  },

  loadMoreSubComments(last, cid, c){
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url:'http://pantip.com/forum/topic/render_replys?last=' + last + '&cid=' + cid + '&c=' + c + '&ac=p&o=',
        success: function(data){
          dataJSON = JSON.parse(data);
          resolve(dataJSON);
        }
      });
    });

  }
}
