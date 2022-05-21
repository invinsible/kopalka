<template>
  <div>
    <p>{{ unite.type === 'hero' ? 'Герой' : 'Чудище' }}</p>
    <p>Сила: {{ unite.stats.strength }}</p>
  </div>
</template>

<script>
export default {
  name: 'BattleUnit',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    unit: {
      type: Object,
    },
  },

  data() {
    return {
      unite: {... this.unit},
    };
  },
};
</script>
