<template>
  <b-container>
    <h1>Лабиринт</h1>
    <b-row>
      <b-col>
        <maze-block :maze="maze" v-if="loaded" />
      </b-col>
    </b-row>
    <b-row style="margin-top: 30px;">
      <b-col>
        <b-button @click="loadMaze()">Regenerate</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import User from '@/api/user';
import MazeBlock from '../components/MazeBlock';

export default {
  name: 'Maze',
  components: {
    MazeBlock,
  },
  data() {
    return {
      maze: {},
      loaded: false,
    };
  },
  async created() {
    await this.loadMaze();
  },
  methods: {
    async loadMaze() {
      const response = await User.getRandomMaze(
          localStorage.getItem('accessToken'),
      );

      console.log(response.data);
      this.maze = response.data;
      this.loaded = true;
    },
  },
};
</script>

<style scoped>

</style>
