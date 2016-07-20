let Vue = require('vue');
let Vars = require('./vars.js');

let themeItem = require('./components/themeItem.vue');

Vue.component('themeItem', themeItem);

let vm = new Vue({
  el: 'body',

  data(){ return {
    forums: Vars.forumInfo
  }},

  methods: {
    saveOptions(){
      let theme = document.getElementById('theme').value;
      let defaultForum = document.getElementById('defaultForum').value;

      chrome.storage.sync.set({
        theme,
        defaultForum
      }, function(){
        //Notify user
        console.log("Options saved");
      });
    },

    restoreOptions(){
      chrome.storage.sync.get({
        theme: 'default',
        defaultForum: 'all'
      }, function(item){
        document.getElementById('theme').value = item.theme;
        document.getElementById('defaultForum').value = item.defaultForum;
      });
    }
  },

  ready(){
    this.restoreOptions();
  }
});
