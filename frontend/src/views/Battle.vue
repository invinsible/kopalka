<template>
  <div class="container">
    <h2>Создать участника боя:</h2>
    <Create-unit @crerateUnit="createUnit" />
    <div>
      <h2>Арена:</h2>
      <Battle-unit
        v-for="(unit, index) in units"
        :key="index"
        :unit="unit"
      />     
    </div>
  </div>
</template>

<script>
import CreateUnit from '@/components/battle/CreateUnit.vue';
import BattleUnit from '@/components/battle/BattleUnit.vue';
export default {
  name: 'Battle',
  components: {
    CreateUnit,
    BattleUnit,
  },
  data() {
    return {
      units: [],
    };
  },

  methods: {
    createUnit(unit) {     
      this.units.push(unit);
    },
  },
};
</script>
