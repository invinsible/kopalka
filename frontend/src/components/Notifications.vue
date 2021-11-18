<template>
  <div class="n-wrapper d-flex">
    <notification
        v-for="(item, index) in notifications"
        :key="`notification-`+index"
        :item="item"
        @close="close"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import Notification from '@/components/Notification.vue';

export default {
  name: 'Notifications',
  components: {
    Notification,
  },
  props: {},

  computed: {
    ...mapGetters(['notifications']),
  },

  watch: {},

  created() {
  },

  mounted() {
  },

  methods: {
    ...mapActions(['closeNotification']),
    close(id) {
      this.closeNotification(id);
    },
  },
};
</script>

<style scoped lang="scss">
.n-wrapper {
  flex-direction: column;
  position: absolute;
  right: 5px;
  top: 0;
  width: 450px;
}

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
