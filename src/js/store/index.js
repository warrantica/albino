import Vue from 'vue';
import Vuex from 'vuex';
import { state, mutations } from './state';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions
});
