let Vue = require('vue');
let Vars = require('./vars.js');

let themeItem = require('./components/themeItem.vue');

let themes = [
  {
    name: 'default', label: 'เผือก (default)',
    primary: '#9C27B0', accent: '#FF5252', brightness: 'light'
  }, {
    name: 'blue', label: 'Blue',
    primary: '#03A9F4', accent: '#FF5252', brightness: 'light'
  }, {
    name: 'red', label: 'สนุก',
    primary: '#F44336', accent: '#FF5252', brightness: 'light'
  }, {
    name: 'thaiair', label: 'รักคุณเท่าฟ้า',
    primary: '#3e075b', accent: '#C4007C', brightness: 'light'
  }
];

Vue.component('themeItem', themeItem);

let vm = new Vue({
  el: 'body',

  data(){ return {
    forums: Vars.forumInfo,
    themes: themes,
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
