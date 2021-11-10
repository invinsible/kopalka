import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/api/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('userToken') || null,
    userId: localStorage.getItem('userId') || null,
  },
  mutations: {
    setToken(state, value) {
      state.token = value;
    },
    setId(state, value) {
      state.userId = value;
    },
  },
  actions: {
    async login({commit}, data) {
      try {
        const response = await User.login(data);
        if (response?.data?.auth_token) {
          const token = response.data.auth_token;
          const id = response.data.id;
          console.log('response.data', response.data);

          localStorage.setItem('userToken', token);
          localStorage.setItem('userId', id);

          commit('setToken', token);
          commit('setId', id);
        }

        return response;
      } catch (error) {
        console.log('error', error);
      }
    },
  },
  modules: {},
});
