import Vars from '../vars';
import Pantip from '../pantipInterface';
import Helper from '../helpers';

export const loadTopicFromId = ({ dispatch, commit, state }, topicId) => {
  //pull down curtains
  $('#rightPane').addClass('wrapUp');
  $('#rightPane .loading').addClass('active');

  if(topicId !== state.currentTopic)
    $('#rightPane').animate({scrollTop:0}, "0.5s");

  return Promise.all([
    Pantip.loadTopic(topicId),
    Pantip.loadComments(topicId)
  ]).then(values => {
    //console.log(values);

    //load topic
    values[0].utime = Helper.convertTheirStupidDateTimeFormatToISO(values[0].utime);
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
    window.clearInterval(state.topicRefreshIntervalId);
    state.topicRefreshIntervalId =  window.setInterval(() => {
      Pantip.loadComments(topicId).then(data => {
        if(data.count >= values[1].count){
          //this.unreadComments = data.count - values[1].count;
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
}

export const loadTopic = ({ commit, state }, data) => {
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
