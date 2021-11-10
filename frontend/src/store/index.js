import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/api/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('accessToken') || null,    
  },
  mutations: {
    setToken(state, value) {
      state.token = value;
    },   
  },
  actions: {
    async login({commit}, data) {
      try {
        const response = await User.authorization(data);
        if (response?.data?.accessToken) {
          const token = response.data.accessToken;
          console.log(response.data.accessToken);
          localStorage.setItem('accessToken', token);
          commit('setToken', token);          
        }

        return response;
      } catch (error) {
        console.log('error', error);
      }
    },
  },
  getters: {
    token: state => !!state.token,
  },
});
