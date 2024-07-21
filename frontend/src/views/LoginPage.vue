<template>
  <div class="login-container">
    <h1>로그인</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">아이디:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div>
        <label for="password">비밀번호:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">로그인</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const authStore = useAuthStore();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const router = useRouter();  // useRouter 훅을 사용하여 라우터 설정

    const handleLogin = async () => {
      try {
        const success = await authStore.login(username.value, password.value);
        if (success) {
          router.push('/home');  // this.$router.push 대신 router.push 사용
        } else {
          errorMessage.value = '로그인에 실패했습니다.';
        }
      } catch (error) {
        errorMessage.value = '로그인에 실패했습니다.';
      }
    };

    return {
      username,
      password,
      errorMessage,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.login-container h1 {
  text-align: center;
}

.login-container form {
  display: flex;
  flex-direction: column;
}

.login-container form div {
  margin-bottom: 15px;
}

.login-container form label {
  margin-bottom: 5px;
  font-weight: bold;
}

.login-container form input {
  padding: 8px;
  font-size: 1rem;
}

.login-container button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #45a049;
}

.login-container p {
  color: red;
  text-align: center;
}
</style>
