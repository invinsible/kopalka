<template>
  <b-container className="main-page">
    <h1>Болото</h1>
    <b-row v-if="!isLoad">
      <b-col cols="12" sm="8" lg="5">
        <Mineral-table :items="table" />
      </b-col>
      <b-col>
        <Buttons-block /> <br />
        <b-button :to="{ name: 'MazeIntro' }">Лабиринт</b-button>
      </b-col> 
    </b-row>       
    <p v-else>Идёт загрузка</p>
    <notifications />
  </b-container>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MineralTable from '@/components/MineralTable.vue';
import ButtonsBlock from '@/components/ButtonsBlock.vue';
import Notifications from '@/components/Notifications.vue';

export default {
  name: 'Home',
  components: {
    MineralTable,
    ButtonsBlock,
    Notifications,
  },
  data() {
    return {
      isLoad: true,
    };
  },
  computed: {
    ...mapGetters(['table']),
  },
  async created() {
    await this.getTable();
    this.isLoad = false;
    this.getNotifications();
  },
  methods: {
    ...mapActions(['getNotifications', 'getTable']),
  },
};
</script>
