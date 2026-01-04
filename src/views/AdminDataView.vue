<template>
  <div class="admin-data-view">
    <div class="ios-navbar">
      <button class="back-button" @click="goBack">← 返回</button>
      <div class="ios-navbar-title">数据查看</div>
      <div style="width: 60px;"></div>
    </div>

    <div class="data-content">
      <div class="ios-card">
        <h2 class="ios-subtitle">选择日期</h2>
        <input 
          type="date" 
          v-model="selectedDate" 
          class="ios-date-picker"
          @change="loadData"
        />
      </div>

      <div v-if="selectedDate" class="ios-card">
        <h2 class="ios-subtitle">流程数据</h2>
        <div class="flow-selector">
          <select v-model="selectedFlow" class="ios-input" @change="loadFlowData">
            <option value="">请选择流程</option>
            <option v-for="flow in flows" :key="flow.id" :value="flow.id">
              {{ flow.name }}
            </option>
          </select>
        </div>

        <div v-if="flowData" class="data-table">
          <div class="ios-table-header">
            <div>编号</div>
            <div>工序名称</div>
            <div>指标名称</div>
            <div>参数类型</div>
            <div>数值</div>
          </div>
          <div 
            v-for="(item, index) in flowData.items" 
            :key="index" 
            class="ios-table-row"
          >
            <div>{{ item.id }}</div>
            <div>{{ item.processName }}</div>
            <div>{{ item.indicatorName }}</div>
            <div>{{ item.paramType }}</div>
            <div>{{ item.value }}</div>
          </div>
        </div>

        <div v-if="flowData && flowData.submitHistory" class="submit-history">
          <h3 class="ios-subtitle">提交记录</h3>
          <div 
            v-for="(record, index) in flowData.submitHistory" 
            :key="index"
            class="history-item"
          >
            {{ record.time }} by {{ record.user }}
          </div>
        </div>

        <button 
          v-if="flowData" 
          class="ios-button ios-button-secondary" 
          @click="exportData"
        >
          当日数据导出
        </button>
      </div>

      <div v-else class="empty-state">
        <p class="ios-text-secondary">请先选择日期</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedDate = ref('')
const selectedFlow = ref('')
const flows = ref([
  { id: 1, name: '流程1' },
  { id: 2, name: '流程2' },
  { id: 3, name: '流程3' }
])
const flowData = ref(null)

// 设置默认日期为今天
onMounted(() => {
  const today = new Date()
  selectedDate.value = today.toISOString().split('T')[0]
  if (route.query.flowId) {
    selectedFlow.value = parseInt(route.query.flowId)
    loadFlowData()
  }
})

const loadData = () => {
  if (selectedDate.value) {
    // 加载数据
    loadFlowData()
  }
}

const loadFlowData = () => {
  if (!selectedFlow.value) {
    flowData.value = null
    return
  }

  // 模拟数据
  flowData.value = {
    items: [
      { id: 1, processName: '压铸', indicatorName: '完成数量', paramType: '数量', value: '499个' },
      { id: 2, processName: '压铸良品率', indicatorName: '百分比', paramType: '百分比', value: '88%' }
    ],
    submitHistory: [
      { time: '14:30', user: '用户A' },
      { time: '10:15', user: '用户B' }
    ]
  }
}

const exportData = () => {
  alert('导出数据功能')
}

const goBack = () => {
  router.push('/admin/dashboard')
}
</script>

<style scoped>
.admin-data-view {
  min-height: 100vh;
  background-color: var(--ios-background);
}

.data-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.flow-selector {
  margin: 16px 0;
}

.data-table {
  margin: 20px 0;
  background-color: var(--ios-white);
  border-radius: 10px;
  overflow: hidden;
}

.submit-history {
  margin-top: 20px;
  padding: 16px;
  background-color: var(--ios-light-gray);
  border-radius: 10px;
}

.history-item {
  padding: 8px 0;
  font-size: 15px;
  color: var(--ios-secondary-text);
  border-bottom: 0.5px solid var(--ios-border);
}

.history-item:last-child {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--ios-secondary-text);
}
</style>
