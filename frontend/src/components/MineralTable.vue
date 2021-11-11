<template>
  <table class="table table-hover table-sm">
    <thead>
      <tr>
        <th scope="col">Название</th>
        <th scope="col">Вероятность</th>
        <th scope="col">Кол-во</th>           
      </tr>
    </thead>
    <tbody>
    <tr v-for="el in items" :key="el.id">
        <td>{{ el.name }}</td>
        <td>{{ el.rate }}%</td>
        <td>{{ el.quantity }}</td>
    </tr>
    </tbody>        
  </table>
</template>

<script>
export default {
  name: 'MineralTable',
  props: {
    items: {
      type: Array,
      default: null,
    },
  },
};
</script>
