<template>
    <div class="ai-prediction">
      <h2>AI 예측</h2>
      <textarea v-model="userInput" placeholder="질문을 입력하세요..."></textarea>
      <button @click="getPrediction" :disabled="loading">예측 요청</button>
      <div v-if="loading">예측 중...</div>
      <div v-if="prediction">
        <h3>예측 결과:</h3>
        <p>{{ prediction }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AIPrediction',
    data() {
      return {
        userInput: '',
        prediction: null,
        loading: false,
      };
    },
    methods: {
      async getPrediction() {
        if (!this.userInput) return;
        this.loading = true;
        try {
          const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/predict`, {
            input: this.userInput
          });
          this.prediction = response.data.prediction;
        } catch (error) {
          console.error('Error fetching prediction:', error);
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .ai-prediction {
    margin: 20px 0;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  
  div {
    margin-top: 20px;
  }
  </style>
  