export const state = {
  showBestTopics: false,
  topicId: 0,
  topicTitle: '',
  topicData: {},
  
  topicRefreshIntervalId: 0,
  unreadComments: 0
}

export const mutations = {
  toggleBestTopics(state){
    state.showBestTopics = ! state.showBestTopics;
  },

  setTopicTitle(state, title){
    state.topicTitle = title;
  },

  setTopicId(state, id){
    state.topicId = id;
  },

  resetUnreadComments(state){ state.unreadComments = 0 },

  setUnreadComments(state, number){ state.unreadComments = number }
}
