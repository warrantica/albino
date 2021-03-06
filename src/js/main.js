//============================================================================
// Require stuff
//============================================================================

import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
Vue.config.devtools = false;

import Vars from './vars';
import Pantip from './pantipInterface';
import Helper from './helpers';

import App from './main.vue';
import store from './store';

Vue.component('toolbarIcon', require('./components/toolbarIcon.vue'));
Vue.component('forumSelectItem', require('./components/forumSelectItem.vue'));
Vue.component('curationItem', require('./components/curationItem.vue'));
Vue.component('topicItem', require('./components/topicItem.vue'));
Vue.component('searchResultItem', require('./components/searchResultItem.vue'));
Vue.component('topicView', require('./components/topicView.vue'));
Vue.component('commentView', require('./components/commentView.vue'));
Vue.component('pagination', require('./components/pagination.vue'));
Vue.component('commentItem', require('./components/commentItem.vue'));
Vue.component('reactionView', require('./components/reactionView.vue'));
Vue.component('tips', require('./pages/tipsPage.vue'));
Vue.component('about', require('./pages/aboutPage.vue'));

//============================================================================
//Event binding stuff
//============================================================================

$('body').on('click', '.spoil-btn', function(e){
  $(this).next().toggle();
});

$('body').on('click', '.fab-button--up', function(e){
  let scrollTo = 0;
  let previousTop = 0;
  $('.rightPane').find('.comment:not(.comment--sub)').each(function(i){
    if(this.getBoundingClientRect().top >= 64){
      scrollTo = previousTop;
      return false; //break
    }
    previousTop = this.getBoundingClientRect().top;
  });
  if(scrollTo !== 0){
    $('.rightPane').stop().animate({
      scrollTop:$('.rightPane').scrollTop() + scrollTo - 64
    }, "0.5s");
  }
});

$('body').on('click', '.fab-button--down', function(e){
  let scrollTo = 0;
  $('.rightPane').find('.comment:not(.comment--sub)').each(function(i){
    if(this.getBoundingClientRect().top > 64){
      scrollTo = this.getBoundingClientRect().top;
      return false; //break
    }
  });
  if(scrollTo !== 0){
    $('.rightPane').stop().animate({
      scrollTop:$('.rightPane').scrollTop() + scrollTo - 64
    }, "0.5s");
  }
});

$('body').on('click', '.img-in-post', function(e){
  $(this).addClass('inLightBox');
  $('.lightBox').addClass('lightBox--active');

  let dimensions = this.getBoundingClientRect();
  $('.lightBox-img').attr('src', $(this).attr('src')).css({
    'top':dimensions.top,
    'left':dimensions.left,
    'max-width':dimensions.width,
    'max-height':dimensions.height
  });
  window.setTimeout(function(){
    $('.lightBox-img').css({
      'top':'',
      'left':'',
      'max-width':'99%',
      'max-height':'99vh'
    }).addClass('lightBox-img--active');
  }, 50);
});

$('body').on('click', '.lightBox', function(e){
  $(this).removeClass('lightBox--active');
  window.setTimeout(function(){
    $('.lightBox-img').removeClass('lightBox-img--active')
      .removeAttr('style')
      .removeAttr('src');
  }, 250);
  $('.rightPane .img-in-post').removeClass('inLightBox');
});

//============================================================================
// Vue Stuff
//============================================================================

let vm = new Vue({
  store,
  render: h => h(App)
}).$mount('.app');

//============================================================================
//Utility function stuff
//============================================================================

chrome.storage.onChanged.addListener(changes => {
  console.log(changes);
  if(changes.theme !== undefined){
    Helper.applyTheme(changes.theme.newValue, '', '');
  }
});
