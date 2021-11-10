<template>
  <div class="home">   
    <h1>привет юзернейм</h1>
    <a @click.prevent="logout">Выйти</a>
  </div>
</template>

<script>
import User from '@/api/user';

export default {  
  name: 'Home',
  methods: {
    async logout() {
      try {
        const response = await User.checkToken(localStorage.getItem('accessToken'));
        console.log(response);
      } catch (e) {
        console.log(e);
      }
      
    },
  },
};
</script>
