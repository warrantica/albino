import Vars from '../vars';
import Pantip from '../pantipInterface';
import Helper from '../helpers';

export const loadTopic = ({ dispatch, commit, state }, topicId) => {
  Helper.setRightPaneCurtains(false);

  if(topicId !== state.currentTopic)
    $('#rightPane').animate({scrollTop:0}, "0.5s");

  return Promise.all([
    Pantip.loadTopic(topicId),
    Pantip.loadComments(topicId)
  ]).then(values => {
    //console.log(values);

    values[0].utime = Helper.convertTimeFormatToISO(values[0].utime);
    commit('setTopicTitle', values[0]['title']);
    commit('setTopicId', topicId);

    //load topic
    values[0].content = Helper.sanitiseContent(values[0].content);

    //avatar
    if(values[0].avatarSrc === '') values[0].avatarSrc = 'asset/img/default_avatar.png';

    //tags
    if(values[0].tags.length > 0) values[0].tags = values[0].tags.join(', ');

    //reactions
    values[0].reactionData = {
      voteSum: values[0].voteCount,
      emotionSum: values[0].emotionCount.sum,
      emotionCounts: values[0].emotionCount,
      emotionSortable: values[0].emotions
    };
    //this.$broadcast('loadReaction', reactionData);

    state.topicData = values[0];
    $('time.timeago').timeago();

    //load comments
    dispatch('loadComments', values[1], topicId === state.topicId);


    Helper.setRightPaneCurtains(true);
    Helper.showFAB();

    //set up polling
    commit('resetUnreadComments');
    window.clearInterval(state.topicRefreshIntervalId);
    state.topicRefreshIntervalId =  window.setInterval(() => {
      Pantip.loadComments(topicId).then(data => {
        if(data.count >= values[1].count){
          commit('setUnreadComments', data.count - values[1].count);
        }
      });
    }, 30000);
  });
}

export const loadComments = ({ dispatch, commit, state }, data, isRefresh = false) => {
  //get commentsPerPage from options
  chrome.storage.sync.get({ commentsPerPage: '5' }, item => {
    console.log("i'm here now");
    //do stuff that needs commentsPerPage value in callback
    commit('setTotalComments', data.count);
    commit('setCommentsPerPage', parseInt(item.commentsPerPage));

    commit('resetShownComments');
    if(state.totalComments > 0) state.comments = data.comments;

    if(state.commentsPerPage < state.totalComments){
      let start = isRefresh ? state.commentPage*state.commentsPerPage : 0;
      state.shownComments = state.comments.slice(start, start + state.commentsPerPage);
    }else{
      commit('setCommentPage', 0);
      state.shownComments = state.comments;
    }
  });
}
