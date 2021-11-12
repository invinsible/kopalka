<template>
  <div v-if="!isLoad">
    <user-status :status="workStatus" :result="result" :timerCount="timerCount" />
    <b-button-group>
      <b-button v-if="!workStatus" @click.prevent="startWork" variant="info">Собирать травы</b-button>  
      <b-button @click.prevent="getStatus" variant="warning">Проверить токен</b-button>     
    </b-button-group>    
  </div>  
  <b-spinner v-else variant="primary" type="grow" label="Spinning"></b-spinner>
</template>

<script>
import {mapGetters} from 'vuex';
import User from '@/api/user';
import UserStatus from '@/components/UserStatus.vue';
export default {
  name: 'ButtonsBlock',
  components: {
    UserStatus,
  },
  data() {
    return {
      result: '',
      timerCount: 0,
      isLoad: true,
    };
  },
  computed: {
    ...mapGetters([
      'workStatus',      
    ]),
  },
  created() {
    this.getStatus();    
  },
  methods: {
    async getStatus() {
      await this.$store.dispatch('getStatus', localStorage.getItem('accessToken'));  
      this.isLoad = false;    
    },

    async check() {
      try {
        const response = await User.checkToken(
          localStorage.getItem('accessToken'),
        );
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    },

    async startWork() {
      const response = await User.startWork(localStorage.getItem('accessToken'));
      this.$store.commit('setStatus', response.data.cycle);
      const timeDifference = this.workStatus.timeEnd - Date.now() + 1000;
      this.timerCount = timeDifference;
      setTimeout(() => {
        this.getStatus();
      }, timeDifference);
    },
  },
};
</script>
