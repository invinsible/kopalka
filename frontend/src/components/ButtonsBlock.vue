<template>
  <div v-if="!isLoad">
   
    <div v-if="workStatus">
      <p>Вы собираете травы. {{ timerText }}</p>    
    </div>

    <b-button-group>
      <b-button v-if="!workStatus" @click.prevent="startWork" variant="info"
        >Собирать травы</b-button
      >      
    </b-button-group>
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
    ...mapGetters(['workStatus']),
    timerText() {      
      const min = Math.floor((this.timeDiffernce / 1000 / 60) << 0);
      const sec = Math.floor((this.timeDiffernce / 1000) % 60);
      return `осталось работать: ${min} мин ${sec} сек`;
    },
    timeDiffernce() {
      return this.workStatus?.timeEnd - new Date().getTime();
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
