import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/api/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    workStatus: null,
    workResult: '',
    refreshToken: localStorage.getItem('refreshToken') || null,
    accessToken: localStorage.getItem('accessToken') || null,
    // inventory: null,
    table: null,

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
    setTable(state, value) {
      state.table = value;
    },
    // setInventory(state, value) {
    //   state.inventory = value;
    // },
    setStatus(state, value) {
      state.workStatus = value;
    },
    setWorkResult(state, value) {
      state.workResult = value;
    },
    
  },
  actions: {
    async login({commit, dispatch}, data) {
      try {
        await dispatch('getRefreshToken', data);
        await dispatch('getAccessToken');
        return true;
      } catch (e) {
        commit('addNotification', {
          force: true,
          title: 'Login Error. ' + e.toString(),
          type: 'danger',
        });
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

    async checkToken({commit}, token) {
      try {
        const response = await User.checkToken(token);
        if (response.data) {
          commit('setUser', response.data);
          return response;
        }
      } catch (error) {
        commit('addNotification', {
          force: true,
          title: 'Check Token Error. ' + error.toString(),
          type: 'danger',
        });
      }
    },

    // async getInventory({commit}) {
    //   try {
    //     const response = await User.getInventory();
    //     if (response) {
    //       commit('setInventory', response.data);
    //       return;
    //     }
    //   } catch (error) {
    //     commit('addNotification', {
    //       force: true,
    //       title: 'Get Inventory Error. ' + error.toString(),
    //       type: 'danger',
    //     });
    //   }
    // },

    async getTable({commit}) {
      try {
        const response = await User.getTable();
        if (response) {
          commit('setTable', response.data);
          return;
        }
      } catch (error) {
        commit('addNotification', {
          force: true,
          title: 'Get Table Error. ' + error.toString(),
          type: 'danger',
        });
      }
    },

    async getStatus({commit}) {
      const response = await User.getStatus();      
      commit('setStatus', response.data.cycle);
      return response;
    },



    async closeNotification({commit}, id) {
      commit('removeNotification', id);
    },
  },
  getters: {
    refreshToken: state => state.refreshToken,
    isRefreshToken: state => !!state.refreshToken,
    isAccessToken: state => !!state.accessToken,
    // inventory: state => state.inventory,
    table: state => {
      function byField(field) {
        return (a, b) => a[field] > b[field] ? -1 : 1;
      }
      return state.table.sort(byField('rate'));
    },
    workStatus: state => state.workStatus,
    workResult: state => state.workResult,
    isUserAdmin: state => state.user.isAdmin,    
  },
});
