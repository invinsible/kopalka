<template>
  <b-container class="main-page">
    <h1>привет юзернейм  ({{ isRefreshToken }})</h1>
    <b-table striped hover :items="items"></b-table>
    <a @click.prevent="check">Проверить токен</a>
  </b-container>
</template>

<script>
import {mapGetters} from 'vuex';
import User from '@/api/user';

export default {  
  name: 'Home',
  data() {
    return {
      items: [
          {puk: 40, first_name: 'Dickerson', last_name: 'Macdonald'},
          {puk: 21, first_name: 'Larsen', last_name: 'Shaw'},
          {puk: 89, first_name: 'Geneva', last_name: 'Wilson'},
          {puk: 38, first_name: 'Jami', last_name: 'Carney'},
        ],
    };
  },
  computed: {
    ...mapGetters([      
      'isRefreshToken',
    ]),
  },
  methods: {
    async check() {
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
