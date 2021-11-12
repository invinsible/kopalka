<template>
  <div v-if="load">
    <user-status :status="workStatus" :result="result" :timerCount="timerCount" />
    <b-button-group>
      <b-button v-if="!workStatus.cycle" @click.prevent="startWork" variant="info">Собирать травы</b-button>  
      <b-button @click.prevent="check" variant="warning">Проверить токен</b-button>     
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
      timerCount: 30,
    };
  },
  computed: {
    ...mapGetters([
      'workStatus',      
    ]),
    load() {
      return this.workStatus;
    },
  },
  created() {
    this.getStatus();
  },
  methods: {
    getStatus() {
      this.$store.dispatch('getStatus', localStorage.getItem('accessToken'));
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
      this.$store.commit('setStatus', response.data);
    },
  },
};
</script>
