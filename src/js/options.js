import Vue from 'vue';
import Vars from './vars';

import App from './options.vue';

Vue.component('themeItem', require('./components/themeItem.vue'));
Vue.component('themePreview', require('./components/themePreview.vue'));

let vm = new Vue({
  render: h => h(App)
}).$mount('#app');
