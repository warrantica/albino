export const state = {
  showDialogues: {
    forumSelect: false,
    overflow: false,
    commentSort: false
  },
  showBestTopics: false,

  forumName: '',
  topics: [],
  bestTopics: [],
  loadMoreId: 0,
  topTopicId: 0,

  pageName: '',

  searchQuery: '',
  searchQueryString: '',
  searchResults: [],

  topicId: 0,
  topicTitle: '',
  topicData: {},

  comments: [],
  shownComments: [],
  totalComments: 0,
  commentsPerPage: 5,
  commentPage: 0,
  loadedPage: 1,

  topicRefreshIntervalId: 0,
  unreadComments: 0
}

export const mutations = {
  toggleBestTopics(state){ state.showBestTopics = ! state.showBestTopics; },
  hideBestTopics(state){ state.showBestTopics = false },

  setForumName(state, name){ state.forumName = name },

  resetTopics(state){ state.topics = [] },
  addToTopics(state, topic){ state.topics.push(topic) },

  setSearchQuery(state, query){ state.searchQuery = query; },

  setTopicId(state, id){ state.topicId = id; },

  setTopicTitle(state, title){ state.topicTitle = title; },

  setTotalComments(state, number){ state.totalComments = number; },

  setCommentsPerPage(state, number){ state.commentsPerPage = number; },

  setCommentPage(state, page){ state.commentPage = page; },

  resetShownComments(state){ state.shownComments = []; },

  resetUnreadComments(state){ state.unreadComments = 0 },
  setUnreadComments(state, number){ state.unreadComments = number }
}
