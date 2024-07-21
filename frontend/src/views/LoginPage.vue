<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Username:</label>
          <input v-model="username" id="username" type="text">
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="password" id="password" type="password">
        </div>
        <button type="submit">Login</button>
      </form>
      <router-link to="/signup">Sign Up</router-link>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '../stores';
  
  export default {
    name: 'LoginPage',
    data() {
      return {
        username: '',
        password: '',
      };
    },
    setup() {
      const authStore = useAuthStore();
      return { authStore };
    },
    methods: {
      handleLogin() {
        if (this.authStore.login(this.username, this.password)) {
          this.$router.push('/home');
        } else {
          alert('Invalid credentials');
        }
      },
    },
  };
  </script>
  