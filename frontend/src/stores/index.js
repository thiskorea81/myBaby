import { createPinia, defineStore } from 'pinia';
import axios from 'axios';

const pinia = createPinia();

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    child: {
      name: '이정윤',
      birthDate: new Date('2024-07-11'),
    },
    records: [],
    currentDate: new Date(),
  }),
  actions: {
    async login(username, password) {
      try {
        console.log('Attempting to log in with:', { username, password });
        const response = await apiClient.post('/api/login', { username, password });
        console.log('Login response:', response.data);
        this.user = response.data;
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    logout() {
      this.user = null;
    },
    async fetchRecords() {
      try {
        const response = await apiClient.get('/api/records');
        this.records = Array.isArray(response.data) ? response.data.map(record => ({
          ...record,
          date: new Date(record.date),
        })) : [];
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    },
    async addRecord(type, details = '') {
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newRecord = { type, details, time, date: this.currentDate };
      try {
        const response = await apiClient.post('/api/records', newRecord);
        newRecord._id = response.data;
        this.records.push(newRecord);
      } catch (error) {
        console.error('Error adding record:', error);
      }
    },
    async updateRecord(id, newType, newDetails) {
      const record = this.records.find(record => record._id === id);
      if (record) {
        const updatedRecord = { ...record, type: newType, details: newDetails };
        try {
          const response = await apiClient.put(`/api/records/${id}`, updatedRecord);
          console.log('Update response:', response.data);
          Object.assign(record, updatedRecord);
        } catch (error) {
          console.error('Error updating record:', error);
        }
      }
    },
    async deleteRecord(id) {
      try {
        await apiClient.delete(`/api/records/${id}`);
        this.records = this.records.filter(record => record._id !== id);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    },
    setDate(newDate) {
      this.currentDate = newDate;
    },
    changeDate(days) {
      const newDate = new Date(this.currentDate);
      newDate.setDate(newDate.getDate() + days);
      this.currentDate = newDate;
    },
    addWakeRecord() {
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      const sleepRecord = this.records.slice().reverse().find(record => record.type === '취침' && record.date.toDateString() === this.currentDate.toDateString());

      if (sleepRecord) {
        const sleepTime = new Date(sleepRecord.date);
        sleepTime.setHours(parseInt(sleepRecord.time.split(':')[0]));
        sleepTime.setMinutes(parseInt(sleepRecord.time.split(':')[1]));

        const wakeTime = new Date();
        const duration = ((wakeTime - sleepTime) / 1000 / 60 / 60).toFixed(2); // 수면 시간 계산 (시간 단위)

        const newRecord = { type: `기상 (수면 시간: ${duration} 시간)`, time, date: this.currentDate };
        this.records.push(newRecord);
      } else {
        const newRecord = { type: '기상', time, date: this.currentDate };
        this.records.push(newRecord);
      }
    },
  },
  getters: {
    childAge() {
      const now = new Date();
      const birthDate = new Date(this.child.birthDate);
      const ageInMilliseconds = now - birthDate;
      const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

      const ageInYears = Math.floor(ageInDays / 365.25);
      const remainingDays = ageInDays % 365.25;

      return {
        years: ageInYears,
        days: remainingDays,
      };
    },
    filteredRecords() {
      return this.records.filter(record =>
        record.date.toDateString() === this.currentDate.toDateString()
      );
    },
  },
});

export default pinia;
