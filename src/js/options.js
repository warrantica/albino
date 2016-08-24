let Vue = require('vue');
let Vars = require('./vars.js');

let themeItem = require('./components/themeItem.vue');
let themePreview = require('./components/themePreview.vue');

Vue.component('themeItem', themeItem);
Vue.component('themePreview', themePreview);

let vm = new Vue({
  el: 'body',

  data(){ return {
    forums: Vars.forumInfo,
    themes: Vars.themes,
    fontSizes: Vars.fontSizes,
    fontFaces: Vars.fontFaces,
    options: {
      defaultForum: 'all',
      theme: 'default',
      fontSize: '26'
    },
    saveButtonState: 'default'
  }},

  methods: {
    saveOptions(){
      let saveButton = document.querySelector('.saveButton');
      saveButton.disabled = true;
      chrome.storage.sync.set(this.options, () => {
        //Notify user
        this.saveButtonState = 'success';
        window.setTimeout(() => {
          this.saveButtonState = 'default';
          saveButton.disabled = false;
        }, 3000);
        console.log("Options saved");
      });
    }
  },

  ready(){
    //restore options
    chrome.storage.sync.get(this.options, item => this.options = item);
  }
});
