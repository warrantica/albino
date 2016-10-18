//============================================================================
//Browserify require stuff
//============================================================================

let Vue = require('vue');
let Vuex = require('vuex');

Vue.use(Vuex);

Vue.config.devtools = false;

import Vars from './vars';
import Pantip from './pantipInterface';
import Helper from './helpers';

//============================================================================
//Event binding stuff
//============================================================================

$('#rightPane').on('click', '.spoil-btn', function(e){
  $(this).next().toggle();
});

$('#fab').on('click', '.topContainer', function(e){
  let scrollTo = 0;
  let previousTop = 0;
  $('#rightPane').find('.comment:not(.sub)').each(function(i){
    if(this.getBoundingClientRect().top >= 64){
      scrollTo = previousTop;
      return false; //break
    }
    previousTop = this.getBoundingClientRect().top;
  });
  if(scrollTo !== 0){
    $('#rightPane').stop().animate({
      scrollTop:$('#rightPane').scrollTop() + scrollTo - 64
    }, "0.5s");
  }
});

$('#fab').on('click', '.bottomContainer', function(e){
  let scrollTo = 0;
  $('#rightPane').find('.comment:not(.sub)').each(function(i){
    if(this.getBoundingClientRect().top > 64){
      scrollTo = this.getBoundingClientRect().top;
      return false; //break
    }
  });
  if(scrollTo !== 0){
    $('#rightPane').stop().animate({
      scrollTop:$('#rightPane').scrollTop() + scrollTo - 64
    }, "0.5s");
  }
});

$('#rightPane').on('click', '.img-in-post', function(e){
  $(this).addClass('inLightBox');
  $('#lightBox').addClass('active');

  let dimensions = this.getBoundingClientRect();
  $('#lightBox img').attr('src', $(this).attr('src')).css({
    'top':dimensions.top,
    'left':dimensions.left,
    'max-width':dimensions.width,
    'max-height':dimensions.height
  });
  window.setTimeout(function(){
    $('#lightBox img').css({
      'top':'',
      'left':'',
      'max-width':'99%',
      'max-height':'99vh'
    }).addClass('active');
  }, 50);
});

$('#lightBox').on('click', function(e){
  $(this).removeClass('active');
  window.setTimeout(function(){
    $('#lightBox img').removeClass('active').removeAttr('style').removeAttr('src');
  }, 250);
  $('#rightPane .img-in-post').removeClass('inLightBox');
});

/*===========================================================================

        V888     888
        888     888
        888     888
        Y88b   d88P 888  888  .d88b.
         Y88b d88P  888  888 d8P  Y8b
          Y88o88P   888  888 88888888
           Y888P    Y88b 888 Y8b.
            Y8P      "Y88888  "Y8888

===========================================================================*/

import store from './store';

Vue.component('toolbarIcon', require('./components/toolbarIcon.vue'));
Vue.component('forumSelectItem', require('./components/forumSelectItem.vue'));
Vue.component('bestTopicItem', require('./components/bestTopicItem.vue'));
Vue.component('topicItem', require('./components/topicItem.vue'));
Vue.component('searchResultItem', require('./components/searchResultItem.vue'));
Vue.component('topicView', require('./components/topicView.vue'));
Vue.component('commentView', require('./components/commentView.vue'));
Vue.component('pagination', require('./components/pagination.vue'));
Vue.component('commentItem', require('./components/commentItem.vue'));
Vue.component('reactionView', require('./components/reactionView.vue'));
Vue.component('tips', require('./pages/tipsPage.vue'));
Vue.component('about', require('./pages/aboutPage.vue'));

import App from './main.vue';

let vm = new Vue({
  store,
  render: h => h(App)
}).$mount('#app');

//============================================================================
//Utility function stuff
//============================================================================

chrome.storage.onChanged.addListener(changes => {
  console.log(changes);
  if(changes.theme !== undefined){
    vm.$broadcast('applyTheme', changes.theme.newValue);
  }
});
