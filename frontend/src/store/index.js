import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/api/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    accessToken: localStorage.getItem('accessToken') || null,
  },
  mutations: {
    setRefreshToken(state, value) {
      state.refreshToken = value;
    },  
    setAccessToken(state, value) {
      state.accessToken = value;
    },
    setUser(state, value) {
      state.user = value;
    },
  },
  actions: {
    async login({dispatch}, data) {
      try {
        await dispatch('getRefreshToken', data);
        await dispatch('getAccessToken');
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    async getRefreshToken({commit}, data) {
      const refreshResponse = await User.getRefreshToken(data);
      if (refreshResponse?.data?.refreshToken) {
        localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
        commit('setRefreshToken', refreshResponse.data.refreshToken);
      }
      return refreshResponse;
    },

    async getAccessToken({commit}) {
      const authRespone = await User.authorization(this.state.refreshToken);          
      if (authRespone?.data?.accessToken) {        
        localStorage.setItem('accessToken', authRespone.data.accessToken);
        commit('setAccessToken', authRespone.data.accessToken);
      }      
      return authRespone;
    },

    // eslint-disable-next-line no-empty-pattern
    async checkToken({}, token) {
      try {
        const response = await User.checkToken(token);        
        if (response) {
          return response;
        }
      } catch (error) {
        console.log('CheckToken Error', error);
      }
    },
  },
  getters: {    
    refreshToken: state => state.refreshToken,
    isRefreshToken: state => !!state.refreshToken,
    isAccessToken: state => !!state.accessToken,
  },
});
