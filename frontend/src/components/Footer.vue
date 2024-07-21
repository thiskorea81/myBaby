<template>
    <footer class="footer">
      <router-link to="/home">홈</router-link> |
      <router-link to="/signup">회원가입</router-link> |
      <router-link to="/admin">관리자 페이지</router-link>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #f8f9fa;
    padding: 1em;
    text-align: center;
    position: fixed;
    width: 100%;
    bottom: 0;
  }
  </style>
  