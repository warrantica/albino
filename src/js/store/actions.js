import Vars from '../vars';
import Pantip from '../pantipInterface';
import Helper from '../helpers';

export const dismissDialogues = ({ dispatch, commit, state }) => {
  for(let key in state.showDialogues){
    if(state.showDialogues.hasOwnProperty(key)){
      state.showDialogues[key] = false;
    }
  }
}

export const showDialogue = ({dispatch, commit, state}, name) => {
  dispatch('dismissDialogues');
  if(state.showDialogues[name] === undefined) return false;
  state.showDialogues[name] = true;
}

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
    $('.leftPane').addClass('leftPane--wrapUp');
    $('.loading--left').addClass('loading--active');
    commit('resetTopics');

    Pantip.loadBestTopics(payload.forumName).then(data => state.bestTopics = data);
  }

  Pantip.loadTopics(payload.forumName, _loadMoreId).then(data => {
    //console.log(data);
    $('.leftPane').removeClass('leftPane--wrapUp');
    $('.loading--left').removeClass('loading--active');

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
    $('.searchResultList').addClass('searchResultList--wrapUp');
    $('.loading--search').addClass('loading--active');
  }
  console.log(...searchArguments);
  Pantip.search(...searchArguments).then(data => {
    //console.log(data);
    if(payload.loadMore){
      state.searchResults.push(...data.results);
    }else{
      state.searchResults = data.results;
      state.searchQueryString = data.queryString;
      $('.searchResultList').removeClass('searchResultList--wrapUp');
      $('.loading--search').removeClass('loading--active');
    }
  });
}

export const loadPage = ({ dispatch, commit, state }, pageName) => {
  commit('setTopicTitle', '');
  commit('setTopicId', 0);
  window.clearInterval(state.topicRefreshIntervalId);
  state.unreadComments = 0;
  state.pageName = pageName;
}

export const loadTopic = ({ dispatch, commit, state }, topicId) => {

  let isRefresh = topicId === state.topicId;
  Helper.setRightPaneCurtains(false);

  if(!isRefresh) $('.rightPane').animate({scrollTop:0}, "0.5s");

  commit('setTopicId', topicId);
  commit('setTopicTitle', '');

  Pantip.loadTopic(topicId).then(data => {
    data.utime = Helper.convertTimeFormatToISO(data.utime);
    commit('setTopicTitle', data['title']);

    //load topic
    data.content = Helper.sanitiseContent(data.content);

    if(data.avatarSrc === '') data.avatarSrc = 'asset/img/default_avatar.png';
    if(data.tags.length > 0) data.tags = data.tags.join(', ');

    //reactions
    data.reactionData = {
      voteSum: data.voteCount,
      emotionSum: data.emotionCount.sum,
      emotionCounts: data.emotionCount,
      emotionSortable: data.emotions
    };

    state.topicData = data;
    $('time.timeago').timeago();

    Helper.setRightPaneCurtains(true);

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

  Pantip.loadComments(topicId).then(data => {
    if(!isRefresh){
      state.loadedPage = 1;
      state.commentPage = 0;
    }

    dispatch('loadComments', { data, isRefresh });
    Helper.showFAB();
  });

  //THEN load more comments

//=========================================================================================================
//=========================================================================================================
//=========================================================================================================
//=========================================================================================================
/*
  return Promise.all([
    Pantip.loadTopic(topicId),
    Pantip.loadComments(topicId)
  ]).then(values => {
    //console.log(values);

    values[0].utime = Helper.convertTimeFormatToISO(values[0].utime);
    commit('setTopicTitle', values[0]['title']);

    state.loadedPage = 1;
    state.commentPage = 0;

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
    dispatch('loadComments', {
      data: values[1],
      isRefresh: topicId === state.topicId
    });


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
*/
//=========================================================================================================
//=========================================================================================================
//=========================================================================================================
//=========================================================================================================
}

export const loadSearchResult = ({ dispatch, commit, state }, url) => {
  Pantip.getTopicIdFromSearch(url).then(id => {
    dispatch('loadTopic', id);
  });
}

/*
payload = {
  data
  isRefresh
}
*/
export const loadComments = ({ dispatch, commit, state }, payload) => {
  chrome.storage.sync.get({ commentsPerPage: '5' }, item => {
    commit('setTotalComments', payload.data.count);
    commit('setCommentsPerPage', parseInt(item.commentsPerPage));
    commit('resetShownComments');

    payload.data.comments.forEach((element, index, array) => {
      array[index] = Helper.vetComment(element);
      if(element.reply_count > 0){
        element.replies.forEach((subElement, subIndex, subArray) => {
          subArray[subIndex] = Helper.vetComment(subElement, true);
        });
      }
    });

    state.comments = state.totalComments ? payload.data.comments : [];

    dispatch('sortComments', 'story');
    console.log(state.sortedComments);

    if(state.commentsPerPage < state.totalComments){
      let start = payload.isRefresh ? state.commentPage*state.commentsPerPage : 0;
      state.shownComments = state.comments.slice(start, start + state.commentsPerPage);
    }else{
      commit('setCommentPage', 0);
      state.shownComments = state.comments;
    }

  });
}

export const loadMoreComments = ({ dispatch, commit, state }) => {
  //let start = pageNumber*state.commentsPerPage;
  return Pantip.loadComments(state.topicId, ++state.loadedPage).then(data => {
    data.comments.forEach((element, index, array) => {
      array[index] = Helper.vetComment(element);
      if(element.reply_count > 0){
        element.replies.forEach((subElement, subIndex, subArray) => {
          subArray[subIndex] = Helper.vetComment(subElement, true);
        });
      }
    });

    state.comments.push(...data.comments);

    //state.shownComments = state.comments.slice(start, start + state.commentsPerPage);

    //DANGER!?
    if(state.totalComments > state.comments.length) dispatch('loadMoreComments');
  });
}

export const goToCommentPage = ({ dispatch, commit, state }, pageNumber) => {
  if(pageNumber < 0 || pageNumber >= state.totalComments/state.commentsPerPage)
    return false;

  commit('resetShownComments');

  let start = pageNumber*state.commentsPerPage;
  state.shownComments = state.comments.slice(start, start + state.commentsPerPage);
  state.commentPage = pageNumber;

  if(state.shownComments.length === 0){
    dispatch('loadMoreComments').then(data => {
      state.shownComments = state.comments.slice(start, start + state.commentsPerPage);
    });
  }

  let scrollTo = document.querySelector('.commentsInfo').getBoundingClientRect().top;
  $('.rightPane').stop().animate({
    scrollTop: $('.rightPane').scrollTop() + scrollTo - 64
  }, "0.5s");
}

export const sortComments = ({dispatch, commit, state}, mode) => {
  state.sortedComments = [];
  switch (mode) {
    default:
    case 'time':
      //Referenced, not copied
      state.sortedComments = state.comments;
      break;
    case 'story':
      state.comments.forEach((element, index, array) => {
        if(element.owner_topic) state.sortedComments.push(element);
      });
      break;
    case 'hot':
      //concat for shallow copy
      /*state.sortedComments = state.comments.concat().sort((a, b) => {

      });*/
      break;
  }
}
