let Vue = require('vue');
let Vars = require('./vars.js');

let themeItem = require('./components/themeItem.vue');

Vue.component('themeItem', themeItem);

let vm = new Vue({
  el: 'body',

  data(){ return {
    forums: Vars.forumInfo,
    themes: Vars.themes,
    options: {
      defaultForum: 'all',
      theme: 'default'
    }
  }},

  methods: {
    saveOptions(){
      chrome.storage.sync.set(this.options, () => {
        //Notify user
        console.log("Options saved");
      });
    }
  },

  ready(){
    //restore options
    chrome.storage.sync.get(this.options, item => this.options = item);
  }
});
