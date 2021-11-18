<template>
  <div class="mazeContainer">
    <div class="mazeRow" v-for="(row, y) in maze.cells" :key="'row' + y">
      <div class="mazeCell" v-for="(cell, x) in row" :key="'cell' + x + tick"
           :class="cellClass(cell, x, y)"
           @click="visitCell(x, y)"
      >
        <!--        {{ x }}x{{ y }}<br />-->
        <!--        {{ cell | asBitmap }}-->
      </div>
    </div>
  </div>
</template>

<script>
const N = 1;
const S = 2;
const E = 4;
const W = 8;

export default {
  name: 'MazeBlock',
  filters: {
    asBitmap(cell) {
      return (cell >>> 0).toString(2);
    },
  },
  props: {
    maze: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      visited: [],
      tick: 1,
    };
  },
  created() {
    this.render();
  },
  methods: {
    render() {
      // console.log(this.maze.cells);
    },

    cellClass(cell, x, y) {
      const visited = this.visited[y] && this.visited[y][x];
      return {
        n: visited && (cell & N),
        s: visited && (cell & S),
        e: visited && (cell & E),
        w: visited && (cell & W),
        visited,
      };
    },

    visitCell(x, y) {
      if (!this.visited[y]) {
        this.visited[y] = [];
      }

      this.visited[y][x] = true;
      console.log(this.visited);
      this.tick += 1;
    },
  },
};
</script>

<style scoped>
.mazeContainer {
  font-size: 10px;
  color: #ccc;
  background-color: #bbb;
  display: inline-block;
}

.mazeRow {
  display: flex;
}

.mazeCell {
  width: 35px;
  height: 35px;
  /*margin: -1px 0 0 -1px;*/
  border: 2px none transparent;
  text-align: center;
}

.mazeCell.visited {
  background-color: #fff;
  border-color: #333;
}

.mazeCell.n {
  border-top-style: solid;
}

.mazeCell.s {
  border-bottom-style: solid;

}

.mazeCell.e {
  border-right-style: solid;

}

.mazeCell.w {
  border-left-style: solid;

}
</style>
