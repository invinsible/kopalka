<template>
  <div class="create-unit">
    <h4>Создать персонажа</h4>
    <div>
      <label for="bossType">Босс</label>
      <input id="bossType" type="radio" name="unitType" value="boss" v-model="unit.type">
      <br>
      <label for="heroType">Герой</label>
      <input id="heroType" type="radio" name="unitType" value="hero" v-model="unit.type">
    </div>
    <div>
      <label for="strStat">Сила</label>
      <input id="strStat" type="number" v-model.number="unit.stats.strength" />
    </div>

    <div>
      <label for="agStat">Ловкость</label>
      <input id="agStat" type="number" v-model.number="unit.stats.agility" />
    </div>

    <div>
      <label for="staminaStat">Выносливость</label>
      <input id="staminaStat" type="number" v-model.number="unit.stats.stamina" />
    </div>

    <div>
      <label for="intStat">Интеллект</label>
      <input id="intStat" type="number" v-model.number="unit.stats.intellect" />
    </div>

    <div>
      <label for="kdStat">Класс доспеха</label>
      <input id="kdStat" type="number" v-model.number="unit.stats.kd" />
    </div>

    <b-button @click.prevent="createUnit">Добавить на арену</b-button>
  </div>
</template>

<script>
export default {
  name: 'CreateUnit',

  data() {
    return {
      unit: {
        type: null,
        stats: {
          strength: 0,          
          agility: 0,
          stamina: 0,
          intellect: 0,
          kd: 0,
        },
      },
    };
  },

  methods: {
    cleanForm() {
      this.unit.type = null;
      this.unit.stats.strength = 0;
      this.unit.stats.agility = 0;
      this.unit.stats.stamina = 0;
      this.unit.stats.intellect = 0;
      this.unit.stats.kd = 0;
    },
    createUnit() {
      this.$emit('crerateUnit', this.unit);
      // this.cleanForm();
    },
  },
};
</script>


<style scoped>
input {
  margin-left: 10px;
}

.create-unit {
  padding: 15px;
  margin: 20px 0;
  border: 1px solid #ccc;  
}
</style>
