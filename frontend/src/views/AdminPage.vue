<template>
  <div class="admin-container">
    <h1>관리자 페이지</h1>
    <div class="section">
      <h2>데이터베이스 조회</h2>
      <button @click="fetchRecords">데이터베이스 조회</button>
      <ul>
        <li v-for="record in records" :key="record._id">
          {{ record }}
          <button @click="deleteRecord(record._id)">삭제</button>
        </li>
      </ul>
    </div>
    <div class="section">
      <h2>데이터베이스 초기화</h2>
      <button @click="clearRecords">데이터베이스 초기화</button>
    </div>
    <div class="section">
      <h2>CSV 파일 업로드</h2>
      <input type="file" @change="uploadFile">
    </div>
    <div class="section">
      <h2>CSV 파일 다운로드</h2>
      <button @click="downloadRecords">CSV 다운로드</button>
    </div>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import Footer from '@/components/Footer.vue';

export default {
  name: 'AdminPage',
  components: {
    Footer,
  },
  data() {
    return {
      records: [],
    };
  },
  methods: {
    async fetchRecords() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/records`);
        this.records = response.data;
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    },
    async clearRecords() {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/admin/records`);
        this.records = [];
      } catch (error) {
        console.error('Error clearing records:', error);
      }
    },
    async uploadFile(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      try {
        await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/admin/records/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.fetchRecords();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    },
    async downloadRecords() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/records/download`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'records.csv');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error downloading records:', error);
      }
    },
    async deleteRecord(recordId) {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/records/${recordId}`);
        this.records = this.records.filter(record => record._id !== recordId);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    },
  },
  mounted() {
    this.fetchRecords();
  },
};
</script>

<style scoped>
.admin-container {
  margin: 20px;
}

.section {
  margin-bottom: 20px;
}

button {
  margin-top: 10px;
}
</style>
