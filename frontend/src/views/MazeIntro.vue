<template>
  <b-container>
    <h1>Лабиринт</h1>
    <b-row class="mt-4 mb-4">
      <b-col>
        <b-button variant="outline-secondary" :to="{ name: 'Home' }">
          <b-icon-arrow-left></b-icon-arrow-left>
          Вернуться
        </b-button>
      </b-col>
    </b-row>
    <b-row v-if="!isLoading && !currentMaze" class="mt-4 mb-4">
      <b-col>
        Вы собираетесь зайти в лабиринт. <br />
        Пока есть только один вариант, не скучайте.
      </b-col>
    </b-row>

    <b-row v-if="isLoading">
      <b-col class="text-center">
        <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
      </b-col>
    </b-row>
    <b-row v-if="!isLoading && !currentMaze">
      <b-col cols="4">
        <b-card title="Обычный" class="mb-2">
          <b-card-text>
            <ul>
              <li>Размер: 30x20</li>
              <li>1 вход</li>
            </ul>
          </b-card-text>

          <b-button variant="primary" @click="startMaze(1)">Начать</b-button>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-if="!isLoading && currentMaze">
      <b-col>
        Вы уже в лабиринте. <br /><br />
        <b-button variant="primary" :to="{name:'Maze', params: {id: currentMaze}}">Продолжить</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import User from '@/api/user';

export default {
  name: 'MazeIntro',
  data() {
    return {
      isLoading: true,
      currentMaze: null,
    };
  },

  async created() {
    await this.loadCurrentMaze();
  },

  methods: {
    async startMaze(type) {
      console.log(`Starting maze ${type}`);
      this.isLoading = true;

      try {
        const response = await User.startMaze(
            localStorage.getItem('accessToken'),
        );

        if (response && response.data.id) {
          await this.$router.push({name: 'Maze', params: {id: response.data.id}});
        }

        console.log(response);
      } catch (error) {
        console.error('startMaze error: ', error.response.data.error);
      }

      this.isLoading = false;
    },

    async loadCurrentMaze() {
      const response = await User.getCurrentMaze(
          localStorage.getItem('accessToken'),
      );

      if (response.data && response.data.id) {
        this.currentMaze = response.data.id;
      }

      this.isLoading = false;
    },
  },
};
</script>
