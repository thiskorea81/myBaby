<template>
    <div>
      <h1>Sign Up</h1>
      <form @submit.prevent="handleSignup">
        <div>
          <label for="username">Username:</label>
          <input v-model="username" id="username" type="text">
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="password" id="password" type="password">
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <router-link to="/">Login</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SignupPage',
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      handleSignup() {
        // Signup logic here
        alert('Sign up is not implemented yet.');
      },
    },
  };
  </script>
  