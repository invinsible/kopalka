<template>
  <div class="mazeContainer">
    <div class="mazeRow" v-for="(row, y) in grid" :key="'row' + y">
      <div class="mazeCell" v-for="(cell, x) in row" :key="'cell' + x + tick"
           :class="cellClass(cell)"
           @click="visitCell(cell)"
      >
        <div v-if="!cell.fog">
          <b-icon-house-door v-if="cellHasObject(cell, 'entry')"></b-icon-house-door>
          <b-icon-box-arrow-in-down v-if="cellHasObject(cell, 'stairs-down')"></b-icon-box-arrow-in-down>
        </div>
<!--                {{ cell.coords[0] }}x{{ cell.coords[1] }}<br />-->
<!--                {{ cell.walls | asBitmap }}-->
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
    grid: {
      type: Array,
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

    cellClass(cell) {
      const show = !cell.fog;
      return {
        n: show && (cell.walls & N),
        s: show && (cell.walls & S),
        e: show && (cell.walls & E),
        w: show && (cell.walls & W),
        show,
      };
    },

    visitCell(cell) {
      cell.fog = false;
    },

    cellHasObject(cell, objectType) {
      for (let i = 0; i < cell.objects.length; i++) {
        if (cell.objects[i].type === objectType) {
          return true;
        }
      }

      return false;
    },
  },
};
</script>

<style scoped>
.mazeContainer {
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

.mazeCell.show {
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
