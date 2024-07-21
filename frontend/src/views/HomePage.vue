<template>
  <div class="home-container">
    <div class="section child-info">
      <h1>아이 정보</h1>
      <p>이름: {{ authStore.child.name }}</p>
      <p>나이: {{ authStore.childAge.years }} 세, {{ Math.floor(authStore.childAge.days) }} 일</p>
    </div>
    <div class="section date-navigation">
      <button @click="changeDate(-1)">←</button>
      <span @click="toggleDatePicker">{{ formattedDate }}</span>
      <button @click="changeDate(1)">→</button>
      <input v-if="showDatePicker" type="date" v-model="pickedDate" @change="setDate" />
    </div>
    <div class="section actions">
      <ActionButton label="모유수유" :onClick="() => (showBreastfeedingDialog = true)" />
      <ActionButton label="분유" :onClick="() => (showFormulaDialog = true)" />
      <ActionButton label="소변" :onClick="() => addRecord('소변')" />
      <ActionButton label="대변" :onClick="() => addRecord('대변')" />
      <ActionButton label="취침" :onClick="() => addRecord('취침')" />
      <ActionButton label="기상" :onClick="addWakeRecord" />
    </div>
    <div class="section records">
      <h2>기록</h2>
      <ul>
        <li v-for="record in authStore.filteredRecords" :key="record.id">
          <span>{{ record.time }} - {{ record.type }} {{ record.details }}</span>
          <ActionButton label="수정" :onClick="() => editRecord(record.id, record.type, record.details)" />
          <ActionButton label="삭제" :onClick="() => deleteRecord(record.id)" />
        </li>
      </ul>
    </div>
    <div class="section ai-prediction">
      <AIPrediction />
    </div>
    <div class="section footer">
      <footer>
        <router-link to="/">홈</router-link> |
        <router-link to="/signup">회원가입</router-link>
      </footer>
    </div>

    <!-- 모유수유 입력 다이얼로그 -->
    <div v-if="showBreastfeedingDialog" class="dialog">
      <h3>모유수유 기록</h3>
      <label>
        좌: <input v-model.number="breastfeedingLeft" type="number" /> 분
      </label>
      <label>
        우: <input v-model.number="breastfeedingRight" type="number" /> 분
      </label>
      <ActionButton label="저장" :onClick="addBreastfeedingRecord" />
      <ActionButton label="취소" :onClick="() => (showBreastfeedingDialog = false)" />
    </div>

    <!-- 분유 입력 다이얼로그 -->
    <div v-if="showFormulaDialog" class="dialog">
      <h3>분유 기록</h3>
      <label>
        양: <input v-model.number="formulaAmount" type="number" /> ml
      </label>
      <ActionButton label="저장" :onClick="addFormulaRecord" />
      <ActionButton label="취소" :onClick="() => (showFormulaDialog = false)" />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores';
import { ref, computed, onMounted } from 'vue';
import '@/assets/main.css';
import ActionButton from '@/components/ActionButton.vue';
import AIPrediction from '@/components/AIPrediction.vue';

export default {
  name: 'HomePage',
  components: {
    ActionButton,
    AIPrediction
  },
  setup() {
    const authStore = useAuthStore();

    onMounted(() => {
      authStore.fetchRecords();
    });

    const showDatePicker = ref(false);
    const pickedDate = ref(authStore.currentDate.toISOString().substr(0, 10));

    // Dialog state
    const showBreastfeedingDialog = ref(false);
    const breastfeedingLeft = ref(10);
    const breastfeedingRight = ref(10);

    const showFormulaDialog = ref(false);
    const formulaAmount = ref(60);

    const toggleDatePicker = () => {
      showDatePicker.value = !showDatePicker.value;
    };

    const setDate = (event) => {
      authStore.setDate(new Date(event.target.value));
      showDatePicker.value = false;
    };

    const changeDate = (days) => {
      authStore.changeDate(days);
    };

    const addRecord = (type) => {
      authStore.addRecord(type);
    };

    const addWakeRecord = () => {
      authStore.addWakeRecord();
    };

    const addBreastfeedingRecord = () => {
      const details = `좌: ${breastfeedingLeft.value}분, 우: ${breastfeedingRight.value}분`;
      authStore.addRecord('모유수유', details);
      showBreastfeedingDialog.value = false;
    };

    const addFormulaRecord = () => {
      const details = `${formulaAmount.value}ml`;
      authStore.addRecord('분유', details);
      showFormulaDialog.value = false;
    };

    const editRecord = (id, currentType, currentDetails) => {
      const newType = prompt('새로운 기록 타입을 입력하세요:', currentType);
      const newDetails = prompt('새로운 세부 정보를 입력하세요:', currentDetails);
      if (newType && newDetails !== null) {
        authStore.updateRecord(id, newType, newDetails);
      }
    };

    const deleteRecord = (id) => {
      if (confirm('정말 삭제하시겠습니까?')) {
        authStore.deleteRecord(id);
      }
    };

    const formattedDate = computed(() => {
      return authStore.currentDate.toLocaleDateString();
    });

    return {
      authStore,
      showDatePicker,
      pickedDate,
      toggleDatePicker,
      setDate,
      changeDate,
      addRecord,
      addWakeRecord,
      editRecord,
      deleteRecord,
      formattedDate,
      showBreastfeedingDialog,
      breastfeedingLeft,
      breastfeedingRight,
      showFormulaDialog,
      formulaAmount,
      addBreastfeedingRecord,
      addFormulaRecord,
    };
  },
};
</script>

<style scoped>
.child-info h1 {
  color: #4CAF50;
}
</style>
