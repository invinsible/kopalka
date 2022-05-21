import User from '@/api/user';

const data = {
  workStatus: null,
  workResult: '',    
  // inventory: null,
  table: null,

};

const mutations = {
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
};

const actions = {
  // async getInventory({commit}) {
  //   try {
  //     const response = await User.getInventory();
  //     if (response) {
  //       commit('setInventory', response.data);
  //       return;
  //     }
  //   } catch (error) {
  //     // commit('addNotification', {
  //     //   force: true,
  //     //   title: 'Get Inventory Error. ' + error.toString(),
  //     //   type: 'danger',
  //     // });
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
      // commit('addNotification', {
      //   force: true,
      //   title: 'Get Table Error. ' + error.toString(),
      //   type: 'danger',
      // });
    }
  },

  async getStatus({commit}) {
    const response = await User.getStatus();      
    commit('setStatus', response.data.cycle);
    return response;
  },  
};

const getters = {
    // inventory: state => state.inventory,
    table: state => {
      function byField(field) {
        return (a, b) => a[field] > b[field] ? -1 : 1;
      }
      return state.table.sort(byField('rate'));
    },
    workStatus: state => state.workStatus,
    workResult: state => state.workResult, 
};

export default {
  namespaced: true,
  state: data,
  actions,
  getters,
  mutations,
};
