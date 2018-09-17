import Vue from 'vue';
import App from './App.vue';

const appDiv = document.createElement('div');
document.body.appendChild(appDiv);

// eslint-disable-next-line no-new
new Vue({
  el: appDiv,
  render: h => h(App),
});
