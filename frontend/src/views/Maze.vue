<template>
  <b-container fluid="">
    <h1>Лабиринт</h1>
    <b-row style="margin-top: 30px;">
      <b-col>
        <div class="mazeContainer">

          <div class="mazeRow" v-for="(row, y) in grid" :key="'row' + y">
            <div class="mazeCell" v-for="(cell, x) in row" :key="'cell' + x"
                 :class="cellClass(cell)"
            >
              <div v-if="!cell.fog">
                <span class="cellIcon" v-if="cellHasObject(cell, 'entry')">
                  <b-icon-house-door></b-icon-house-door>
                </span>
                <span class="cellIcon" v-if="cellHasObject(cell, 'stairs-down')">
                  <b-icon-box-arrow-in-down></b-icon-box-arrow-in-down>
                </span>
              </div>

              <!--              <span class="cellIcon cellIcon__player" v-if="cellHasPlayer(cell)">-->
              <!--                <b-icon-person-circle></b-icon-person-circle>-->
              <!--              </span>-->
              <!--                              {{ cell.coords.x }}x{{ cell.coords.y }}<br />-->
              <!--                {{ cell.walls | asBitmap }}-->
            </div>
          </div>

        </div>
      </b-col>

      <b-col>
        <b-row>
          <b-col><h5>Сумка</h5></b-col>
        </b-row>

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

const DIRECTIONS = {N: 1, S: 2, E: 4, W: 8};
// const DX = {N: 0, S: 0, E: 1, W: -1};
// const DY = {N: -1, S: 1, E: 0, W: 0};

export default {
  name: 'Maze',
  filters: {
    asBitmap(cell) {
      return (cell >>> 0).toString(2);
    },
  },

  data() {
    return {
      maze: {},
      grid: [],
      loaded: false,
      currentPosition: {x: null, y: null},
    };
  },

  computed: {
    currentPositionCell() {
      return this.grid[this.currentPosition.y][this.currentPosition.x];
    },
  },

  async created() {
    await this.loadMaze(this.$route.params.id);
    window.removeEventListener('keydown', this.onKeyboardEvent);
    window.addEventListener('keydown', this.onKeyboardEvent);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyboardEvent);
  },

  methods: {
    async loadMaze(id) {
      const response = await User.getMaze(
          localStorage.getItem('accessToken'),
          id,
      );

      const grid = [];
      const objects = this.prepareObjects(response.data.maze.objects);

      for (let y = 0; y < response.data.maze.cells.length; y++) {
        grid[y] = [];

        for (let x = 0; x < response.data.maze.cells[y].length; x++) {
          grid[y][x] = {
            coords: {x, y},
            walls: response.data.maze.cells[y][x],
            fog: response.data.fogEnabled,
            objects: objects[y] && objects[y][x] ? objects[y][x] : [],
          };
        }
      }

      this.maze = response.data;
      this.grid = grid;

      // Находим и заполняем текущую позицию
      this.currentPosition = response.data.currentPosition;
      this.currentPositionCell.fog = false;

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

    cellClass(cell) {
      const show = !cell.fog;
      return {
        n: show && (cell.walls & DIRECTIONS.N),
        s: show && (cell.walls & DIRECTIONS.S),
        e: show && (cell.walls & DIRECTIONS.E),
        w: show && (cell.walls & DIRECTIONS.W),
        show,
        currentPosition: this.cellHasPlayer(cell),
      };
    },

    cellGetObjects(cell, objectType) {
      const objects = [];
      for (let i = 0; i < cell.objects.length; i++) {
        if (cell.objects[i].type === objectType) {
          objects.push(cell.objects[i]);
        }
      }

      return objects;
    },

    cellHasObject(cell, objectType) {
      return this.cellGetObjects(cell, objectType).length > 0;
    },

    cellHasPlayer(cell) {
      return cell.coords.x === this.currentPosition.x && cell.coords.y === this.currentPosition.y;
    },

    onKeyboardEvent(event) {
      const actions = {
        KeyW: () => {
          this.move('N');
        },
        KeyS: () => {
          this.move('S');
        },
        KeyA: () => {
          this.move('W');
        },
        KeyD: () => {
          this.move('E');
        },
      };

      if (actions[event.code] !== undefined) {
        event.preventDefault();
        actions[event.code]();
      }
    },

    async move(direction) {
      if (this.currentPositionCell.walls & DIRECTIONS[direction]) {
        return false;
      }

      const response = await User.moveInMaze(
          localStorage.getItem('accessToken'),
          direction,
      );

      console.log(response.data);

      this.currentPosition = {
        x: response.data.x,
        y: response.data.y,
      };

      this.onCellVisit(this.currentPositionCell);

      return true;
    },

    /**
     * Действия при посещении клетки
     * @param cell
     */
    onCellVisit(cell) {
      console.log('onVisitCell', cell);
      cell.fog = false;
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

.mazeCell.currentPosition {
  box-shadow: inset 0px 0px 7px 3px rgb(7 203 42);
}

</style>
