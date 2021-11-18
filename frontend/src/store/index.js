import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/api/user';
import Notifications from '@/api/notifications';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    workStatus: null,
    workResult: '',
    refreshToken: localStorage.getItem('refreshToken') || null,
    accessToken: localStorage.getItem('accessToken') || null,
    inventory: null,
    table: null,
    notifications: [
      {
        id: 0,
        force: false,
        title: 'Success text',
        type: 'success',
      },
      {
        id: 1,
        force: true,
        title: 'Danger text',
        type: 'danger',
      },
      {
        id: 2,
        force: false,
        title: 'Regular every day',
        type: 'regular',
      },
    ],
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
    setInventory(state, value) {
      state.inventory = value;
    },
    setStatus(state, value) {
      state.workStatus = value;
    },
    setWorkResult(state, value) {
      state.workResult = value;
    },
    addNotification(state, notification) {
      notification.id = notification.id ? notification.id : Number(new Date());
      state.notifications.push(notification);
    },
    setNotifications(state, notifications) {
      state.notifications = notifications;
    },
    removeNotification(state, id) {
      state.notifications = state.notifications.filter(item => item.id !== id);
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

    async checkToken({commit}, token) {
      try {
        const response = await User.checkToken(token);
        if (response) {
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

    async getInventory({commit}, token) {
      try {
        const response = await User.getInventory(token);
        if (response) {
          commit('setInventory', response.data);
          return;
        }
      } catch (error) {
        commit('addNotification', {
          force: true,
          title: 'Get Inventory Error. ' + error.toString(),
          type: 'danger',
        });
      }
    },

    async getTable({commit}, token) {
      try {
        const response = await User.getTable(token);
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

    async getStatus({commit}, token) {
      const response = await User.getStatus(token);
      commit('setStatus', response.data.cycle);
      return response;
    },

    async getNotifications({commit}, token) {
      try {
        const response = await Notifications.getNotifications(token);
        if (response) {
          commit('setNotifications', response.data);
          return;
        }
      } catch (error) {
        commit('addNotification', {
          force: true,
          title: 'Get Notifications Error. ' + error.toString(),
          type: 'danger',
        });
      }
    },

    closeNotification({commit}, id) {
      commit('removeNotification', id);
    },
  },
  getters: {
    refreshToken: state => state.refreshToken,
    isRefreshToken: state => !!state.refreshToken,
    isAccessToken: state => !!state.accessToken,
    inventory: state => state.inventory,
    table: state => {
      function byField(field) {
        return (a, b) => a[field] > b[field] ? -1 : 1;
      }
      return state.table.sort(byField('rate'));
    },
    workStatus: state => state.workStatus,
    workResult: state => state.workResult,
    notifications: state => state.notifications,
  },
});
