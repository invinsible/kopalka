<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-group id="input-group-1" label="Логин:" labelFor="userLogin">
      <b-form-input        
        id="userLogin"        
        :class="{'border-danger' : form.username.valid}"
        type="text"
        placeholder=""
        autocomplete="off"
        v-model="form.username.value"        
        trim
      ></b-form-input>
      <p v-if="form.username.valid" class="error-notice">Введите логин</p>
    </b-form-group>
    <b-form-group id="input-group-1" label="Пароль:" labelFor="userPassword">
      <b-form-input
        id="userPassword"        
        :class="{'border-danger' : form.password.valid}"
        type="password"
        placeholder=""
        v-model="form.password.value"
        trim
      ></b-form-input>
      <p v-if="form.password.valid" class="error-notice">Введите пароль</p>
    </b-form-group>
    <b-alert v-show="isError" show variant="danger">Указан неверный логин или пароль</b-alert>    
    <b-button type="submit" variant="primary">Войти</b-button>
  </b-form>
</template>

<script>
// import User from '@/api/user';
export default {
  name: 'LoginForm',
  data() {
    return {
      form: {
        username: {
          value: '',
          valid: false,
        },
        password: {
          value: '',
          valid: false,
        },
      },
      isError: false,
    };
  },
  computed: {
    watchUserName() {
      return this.form.username.value;
    },
    watchUserPassword() {
      return this.form.password.value;
    },
  },
  watch: {
    watchUserName() {
      this.form.username.valid = false;
    },
    watchUserPassword() {
      this.form.password.valid = false;
    },
  },  
  methods: {
    async login() {
      console.log('отправляем данные');
      this.isError = true;
      // await User.authorization(this.form).then(result => {
      //   if (result.status === '401') {
      //     this.isError = true;
      //   }

      //   if (result.status === 'ok') {
      //     this.resetForm();
      //   }
        
      // });
    },

    resetValidNotice() {
      this.form.username.valid = false;
      this.form.password.valid = false;
    },

    resetForm() {
      this.isError = false;
      this.form.username.value = '';
      this.form.password.value = '';
    },
    
    onSubmit() {
      this.resetValidNotice();

      if (!this.form.username.value) {
        this.form.username.valid = true;
      }
      if (!this.form.password.value) {
        this.form.password.valid = true;
      }
      // Отправляем форму
      if (this.form.username.value && this.form.password.value) {        
        this.login();        
      }      
    },
  },
};
</script>
