import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
import VueMasonry from 'vue-masonry-css'

import './assets/scss/global.scss'
import 'animate.css'
import 'flag-icon-css/css/flag-icon.css'
import 'flex.box'

import VuePerfectScrollbar from './components/vue-ps'
import VueFloatLabel from 'vue-float-label'

Vue.use(VueAxios, axios);
Vue.use(VueMasonry);
Vue.axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT;

Vue.component('vue-scroll', VuePerfectScrollbar)
Vue.use(VueFloatLabel)

const fb = require('./db_driver/firebaseInit');

Vue.config.productionTip = false;

// handle page reloads
let app;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
    });
  }
});
