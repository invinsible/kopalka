import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/maze/intro',
    name: 'MazeIntro',
    component: () => import('../views/MazeIntro.vue'),
  },
  {
    path: '/maze/:id',
    name: 'Maze',
    component: () => import('../views/Maze.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/isRefreshToken']) {
        next();
      } else {
        next('/');
      }
    },
  },
  {
    path: '/battle',
    name: 'Battle',
    component: () => import('../views/Battle.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => { 
  if (to.path !== '/login' && !store.getters['auth/isRefreshToken']) {
    next('login');
  } else {
    next();
  }
});

export default router;
