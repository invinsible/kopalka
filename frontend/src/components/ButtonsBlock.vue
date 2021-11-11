<template>
  <div>
    <user-status :status="isWork" :result="result" :timerCount="timerCount" />
    <b-button-group>
      <b-button v-if="!isWork" @click.prevent="startWork" variant="info">Собирать травы</b-button>  
      <b-button @click.prevent="check" variant="warning">Проверить токен</b-button>     
    </b-button-group>    
  </div>  
</template>

<script>
import User from '@/api/user';
import UserStatus from '@/components/UserStatus.vue';
export default {
  name: 'ButtonsBlock',
  components: {
    UserStatus,
  },
  data() {
    return {
      isWork: false,
      result: '',
      timerCount: 30,
    };
  },
  methods: {
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

    startWork() {
      this.isWork = true;
      this.result = '';
      setTimeout(() => {        
        this.isWork = false;
        this.result = 'жёлудь';
      }, 30000);
    },
  },
};
</script>
