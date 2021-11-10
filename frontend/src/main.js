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

startApp();

// if (localStorage.getItem('userToken')) {
//   store.dispatch('user/getUser', Number(localStorage.getItem('userId')))
//       .then(response => {
//         console.log('response', response);
//         startApp();
//       });
// } else {
//   startApp();
// }
