import { createPinia, defineStore } from 'pinia';
import axios from 'axios';

const pinia = createPinia();

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
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
      if (username === 'admin' && password === 'admin') {
        this.user = { username };
        return true;
      }
      return false;
    },
    async fetchRecords() {
      const response = await apiClient.get('/records');
      this.records = response.data.map(record => ({
        ...record,
        date: new Date(record.date),
      }));
    },
    async addRecord(type, details = '') {
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newRecord = { type, details, time, date: this.currentDate };
      const response = await apiClient.post('/records', newRecord);
      newRecord.id = response.data;
      this.records.push(newRecord);
    },
    async updateRecord(id, newType, newDetails) {
      const record = this.records.find(record => record.id === id);
      if (record) {
        const updatedRecord = { ...record, type: newType, details: newDetails };
        await apiClient.put(`/records/${id}`, updatedRecord);
        Object.assign(record, updatedRecord);
      }
    },
    async deleteRecord(id) {
      await apiClient.delete(`/records/${id}`);
      this.records = this.records.filter(record => record.id !== id);
    },
    setDate(newDate) {
      this.currentDate = newDate;
    },
    changeDate(days) {
      const newDate = new Date(this.currentDate);
      newDate.setDate(newDate.getDate() + days);
      this.currentDate = newDate;
    },
    async addWakeRecord() {
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
        const response = await apiClient.post('/records', newRecord);
        newRecord.id = response.data;
        this.records.push(newRecord);
      } else {
        const newRecord = { type: '기상', time, date: this.currentDate };
        const response = await apiClient.post('/records', newRecord);
        newRecord.id = response.data;
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
