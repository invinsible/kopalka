import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

const startApp = () => {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
};

if (localStorage.getItem('accessToken')) {
  store.dispatch('checkToken', localStorage.getItem('accessToken'))
      .then(() => {
        startApp();      
      });
} else {
  startApp();
}
