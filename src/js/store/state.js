export const state = {
  showBestTopics: false,
  currentTopic: 0,
  topicTitle: '',
  topicData: {},
  topicRefreshIntervalId: 0
}

export const mutations = {
  toggleBestTopics(state){
    state.showBestTopics = ! state.showBestTopics;
  },

  setTopicTitle(state, title){
    state.topicTitle = title;
  }
}
