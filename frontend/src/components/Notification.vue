<template>
  <div :class="notificationClass" class="n-item">
    <span>{{ item.title }}</span>
    <button aria-label="Close" class="close" type="button"
            @click="close()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    item: {
      type: Object,
      default() {
        return { };
      },
    },
  },

  computed: {
    notificationClass() {
      return {
        'n-danger': this.item.type === 'danger',
        'n-success': this.item.type === 'success',
        'n-regular': this.item.type === 'regular',
      };
    },
  },

  mounted() {
    // if (!this.item.force) {
    //   setTimeout(this.close, 5000);
    // }
  },

  methods: {
    close() {
      this.$emit('close', Number(this.item.id));
    },
  },
};
</script>

<style scoped lang="scss">
.n-item {
  border-radius: 0.25rem;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  opacity: 0.95;
  padding: 15px;
  width: 100%;
}

.n-danger {
  background-color: #dc3545;
}

.n-regular {
  background-color: #c1c1c1;
}

.n-success {
  background-color: #28a745;
}
</style>
