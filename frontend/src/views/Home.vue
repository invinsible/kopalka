<template>
  <b-container class="main-page">
    <h1>Болото</h1>
    <b-row v-if="!isLoad">
      <b-col cols="12" sm="8" lg="5">
        <mineral-table :items="table" />
      </b-col>
      <b-col>
        <buttons-block />        
      </b-col> 
    </b-row>       
    <p v-else>Идёт загрузка</p>
  </b-container>
</template>

<script>
import {mapGetters} from 'vuex';
import MineralTable from '@/components/MineralTable.vue';
import ButtonsBlock from '@/components/ButtonsBlock.vue';

export default {
  name: 'Home',
  components: {
    MineralTable,
    ButtonsBlock,
  },
  data() {
    return {
      isLoad: true,
    };
  },
  computed: {
    ...mapGetters(['inventory', 'table']),
  },
  created() {
    this.getTable();   
  },
  methods: {    
    async getInventory() {
      await this.$store.dispatch(
        'getInventory',
        localStorage.getItem('accessToken'),
      );
      this.isLoad = false;
    },
    async getTable() {
      await this.$store.dispatch(
        'getTable',
        localStorage.getItem('accessToken'),
      );
      this.isLoad = false;
    },    
  },
};
</script>
