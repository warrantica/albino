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

    values[0].utime = Helper.convertTheirStupidDateTimeFormatToISO(values[0].utime);
    // dispatch('loadTopic', values[0]);
    commit('setTopicTitle', values[0]['title']);
    commit('setTopicId', topicId);

    //load topic
    values[0].content = Helper.sanitiseContent(values[0].content);

    //avatar
    if(values[0].avatarSrc === '') values[0].avatarSrc = 'asset/img/default_avatar.png';

    //tags
    if(values[0].tags.length > 0) values[0].tags = values[0].tags.join(', ');

    state.topicData = values[0];

    //reactions
    let reactionData = {
      voteSum: values[0].voteCount,
      emotionSum: values[0].emotionCount.sum,
      emotionCounts: values[0].emotionCount,
      emotionSortable: values[0].emotions
    };
    //this.$broadcast('loadReaction', reactionData);
    $('time.timeago').timeago();

    //load comments
    values[1].tid = topicId;
    //this.$broadcast('loadCommentView', values[1], topicId === this.currentTopic);

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
