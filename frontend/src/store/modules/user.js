import User from '@/api/user';

const data = {
  user: null,

};

const mutations = {
  setUser(state, value) {
    state.user = value;
  },
};

const actions = {
  async checkToken({commit}, token) {
    try {
      const response = await User.checkToken(token);     
      if (response.data) {
        commit('setUser', response.data);
        return response;
      }
    } catch (error) {
      // commit('addNotification', {
      //   force: true,
      //   title: 'Check Token Error. ' + error.toString(),
      //   type: 'danger',
      // });
    }
  },
  
};

const getters = {
  isUserAdmin: state => state.user.isAdmin, 
 
};

export default {
  namespaced: true,
  state: data,
  actions,
  getters,
  mutations,
};
