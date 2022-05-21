<template>
  <b-container class="login-page">
    <b-row alignV="center" alignH="center" class="minHeight100">
      <b-col cols="8" md="4" lg="4" sm="8">
        <Login-form />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
export default {
  name: 'LoginPage',
  components: {
    LoginForm,
  },

};
</script>

<style scoped>
.minHeight100 {
  min-height: 100vh;
}
</style>
