import Notifications from '@/api/notifications';

const data = {
  notifications: [],
};

const mutations = {
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
};

const actions = {
  async getNotifications({commit}) {
    try {
      const response = await Notifications.getNotifications();
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
};

const getters = {
  notifications: state => state.notifications,
};

export default {
  namespaced: true,
  state: data,
  actions,
  getters,
  mutations,
};
