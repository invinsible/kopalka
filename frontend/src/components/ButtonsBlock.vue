<template>
  <div v-if="!isLoad">
    <p v-if="workStatus">Вы собираете травы. {{ timerText }}</p>
    <p v-if="workResult && !workStatus">{{ resultText }}</p>    
    <b-button v-if="!workStatus" @click.prevent="startWork" variant="info">Собирать травы</b-button>    
  </div>
  <b-spinner v-else variant="primary" type="grow" label="Spinning"></b-spinner>
</template>

<script>
import {mapGetters} from 'vuex';
import User from '@/api/user';
export default {
  name: 'ButtonsBlock',

  data() {
    return {
      isLoad: true,     
    };
  },
  computed: {
    ...mapGetters(['workStatus', 'workResult']),
    timerText() {      
      const min = Math.floor((this.timeDiffernce / 1000 / 60) << 0);
      const sec = Math.floor((this.timeDiffernce / 1000) % 60);
      return `осталось работать: ${min} мин ${sec} сек`;
    },
    timeDiffernce() {
      return this.workStatus?.timeEnd - new Date().getTime();
    },
    resultText() {
       return this.workResult.itemName ? `Вы собрали ${this.workResult.itemName} в количестве ${this.workResult.quantity} шт.` : 'Трава оказалась пожухлой';
       
     },    
  },
  async created() {
    await this.getStatus();
    if (this.workStatus) {
      this.stopWork();
    }
  },
  methods: {
    async getStatus() {
      const respone = await this.$store.dispatch('getStatus', localStorage.getItem('accessToken'));
      this.isLoad = false;
      return respone.data;
    },

    async startWork() {
      const response = await User.startWork(localStorage.getItem('accessToken'));      
      this.$store.commit('setStatus', response.data.cycle);
      this.stopWork();
    },

    stopWork() {
      setTimeout(() => {
        this.isLoad = true;
        this.getStatus().then(resp => {
          this.$store.commit('setWorkResult', resp.previous);
          this.$store.dispatch('getTable', localStorage.getItem('accessToken'));          
        });
      }, this.timeDiffernce);
    },
  },
};
</script>
