import Vars from '../vars';
import Pantip from '../pantipInterface';
import Helper from '../helpers';

/*
payload = {
  forumName : name of forum to load
  loadMore : whether or not this request is from a load more button
}
*/
export const loadTopics = ({ dispatch, commit, state }, payload) => {
  let _loadMoreId = payload.loadMore ? state.loadMoreId : 0;

  commit('setForumName', payload.forumName);
  commit('hideBestTopics');


  if(!payload.loadMore){
    $('#leftPane').addClass('wrapUp');
    $('#leftPane .loading').addClass('active');
    commit('resetTopics');

    Pantip.loadBestTopics(payload.forumName).then(data => state.bestTopics = data);
  }

  Pantip.loadTopics(payload.forumName, _loadMoreId).then(data => {
    //console.log(data);
    $('#leftPane').removeClass('wrapUp');
    $('#leftPane .loading').removeClass('active');

    for(let topic of data['topics']){
      topic.isActive = topic._id === state.topicId;
      topic.isTop = topic._id === state.topTopicId;
      commit('addToTopics', topic);
    }
    state.topTopicId = state.topics[0]._id;
    state.loadMoreId = data.loadMoreID;
  });
}

/*
payload = {
  loadMore : whether or not this request is from a load more button
}
*/
export const search = ({ dispatch, commit, state }, payload) => {
  if(state.searchQuery === '') return false;
  if(payload === undefined) payload = {};
  if(payload.loadMore === undefined) payload.loadMore = false;

  let searchArguments = [state.searchQuery];
  if(payload.loadMore){
    searchArguments.push(state.searchResults.length, state.searchQueryString);
  }else{
    $('.searchResultList').addClass('wrapUp');
    $('.searchResultList .loading').addClass('active');
  }
  console.log(...searchArguments);
  Pantip.search(...searchArguments).then(data => {
    //console.log(data);
    if(payload.loadMore){
      state.searchResults.push(...data.results);
    }else{
      state.searchResults = data.results;
      state.searchQueryString = data.queryString;
      $('.searchResultList').removeClass('wrapUp');
      $('.searchResultList .loading').removeClass('active');
    }
  });
}

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

    if(values[0].avatarSrc === '') values[0].avatarSrc = 'asset/img/default_avatar.png';
    if(values[0].tags.length > 0) values[0].tags = values[0].tags.join(', ');

    //reactions
    values[0].reactionData = {
      voteSum: values[0].voteCount,
      emotionSum: values[0].emotionCount.sum,
      emotionCounts: values[0].emotionCount,
      emotionSortable: values[0].emotions
    };

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

export const loadSearchResult = ({ dispatch, commit, state }, url) => {
  Pantip.getTopicIdFromSearch(url).then(id => {
    dispatch('loadTopic', id);
  });
}

export const loadComments = ({ dispatch, commit, state }, data, isRefresh = false) => {
  chrome.storage.sync.get({ commentsPerPage: '5' }, item => {
    commit('setTotalComments', data.count);
    commit('setCommentsPerPage', parseInt(item.commentsPerPage));
    commit('resetShownComments');

    data.comments.forEach((element, index, array) => {
      array[index] = Helper.vetComment(element);
      if(element.reply_count > 0){
        element.replies.forEach((subElement, subIndex, subArray) => {
          subArray[subIndex] = Helper.vetComment(subElement, true);
        });
      }
    });

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

export const goToCommentPage = ({ dispatch, commit, state }, pageNumber) => {
  if(pageNumber < 0 || pageNumber >= state.totalComments/state.commentsPerPage)
    return false;

  dispatch('resetShownComments');

  let start = pageNumber*state.commentsPerPage;
  state.shownComments = state.comments.slice(start, start + state.commentsPerPage);
  state.commentPage = pageNumber;

  if(state.shownComments.length === 0){
    //this.loadMoreComments(pageNumber);
  }

  let scrollTo = document.querySelector('.commentsInfo').getBoundingClientRect().top;
  $('#rightPane').stop().animate({
    scrollTop: $('#rightPane').scrollTop() + scrollTo - 64
  }, "0.5s");
}
