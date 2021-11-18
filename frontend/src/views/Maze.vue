<template>
  <b-container>
    <h1>Лабиринт</h1>
    <b-row>
      <b-col>
        <maze-block :grid="grid" v-if="loaded" />
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
      grid: [],
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

      const grid = [];
      const objects = this.prepareObjects(response.data.maze.objects);

      for (let y = 0; y < response.data.maze.cells.length; y++) {
        grid[y] = [];

        for (let x = 0; x < response.data.maze.cells[y].length; x++) {
          grid[y][x] = {
            coords: [x, y],
            walls: response.data.maze.cells[y][x],
            fog: response.data.fogEnabled,
            objects: objects[y] && objects[y][x] ? objects[y][x] : [],
          };
        }
      }

      this.maze = response.data;
      this.grid = grid;
      this.loaded = true;
    },

    prepareObjects(objects) {
        const result = [];
        
        for (const object of objects) {
          if (!result[object.coords.y]) {
            result[object.coords.y] = [];
          }
          
          if (!result[object.coords.y][object.coords.x]) {
            result[object.coords.y][object.coords.x] = [];
          }
          
          result[object.coords.y][object.coords.x].push(object);
        }
        
        return result;
    },
  },
};
</script>

<style scoped>

</style>
