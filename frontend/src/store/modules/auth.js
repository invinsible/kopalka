import User from '@/api/user';

const data = {
  refreshToken: localStorage.getItem('refreshToken') || null,
  accessToken: localStorage.getItem('accessToken') || null,
};

const mutations = {
  setRefreshToken(state, value) {
    state.refreshToken = value;
  },
  setAccessToken(state, value) {
    state.accessToken = value;
  },
 
};

const actions = {
  async login({dispatch}, payload) {    
    try {
      await dispatch('getRefreshToken', payload);
      await dispatch('getAccessToken');
      return true;
    } catch (e) {
      // commit('addNotification', {
      //   force: true,
      //   title: 'Login Error. ' + e.toString(),
      //   type: 'danger',
      // });
      return false;
    }
  },
  async getRefreshToken({commit}, payload) {   
    const refreshResponse = await User.getRefreshToken(payload);
    if (refreshResponse?.data?.refreshToken) {
      localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
      commit('setRefreshToken', refreshResponse.data.refreshToken);      
    }
    return refreshResponse;
  },
  async getAccessToken({commit}) {
    const authRespone = await User.authorization(data.refreshToken);
    if (authRespone?.data?.accessToken) {
      localStorage.setItem('accessToken', authRespone.data.accessToken);
      commit('setAccessToken', authRespone.data.accessToken);
    }
    return authRespone;
  },
  
};

const getters = {
  refreshToken: state => state.refreshToken,
  isRefreshToken: state => !!state.refreshToken,
  isAccessToken: state => !!state.accessToken, 
};

export default {
  namespaced: true,
  state: data,
  actions,
  getters,
  mutations,
};
