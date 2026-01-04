<template>
  <div class="admin-dashboard">
    <div class="ios-navbar">
      <button class="back-button" @click="logout">退出</button>
      <div class="ios-navbar-title">综合管理界面</div>
      <div class="user-info">
        <div class="ios-avatar">{{ userStore.currentUser?.name?.charAt(0) || 'A' }}</div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="ios-card">
        <h2 class="ios-subtitle">流程管理</h2>
        <div class="flow-list">
          <div 
            v-for="flow in flows" 
            :key="flow.id" 
            class="flow-item"
          >
            <div class="flow-name">{{ flow.name }}</div>
            <div class="flow-actions">
              <button 
                class="ios-button-small ios-button-secondary" 
                @click="viewData(flow.id)"
              >
                数据查看
              </button>
              <button 
                class="ios-button-small" 
                @click="editFlow(flow.id)"
              >
                编辑
              </button>
            </div>
          </div>
          <button class="ios-button ios-button-secondary" @click="createFlow">
            + 新建流程
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const flows = ref([
  { id: 1, name: '流程1' },
  { id: 2, name: '流程2' },
  { id: 3, name: '流程3' }
])

const viewData = (flowId) => {
  router.push({ path: '/admin/data', query: { flowId } })
}

const editFlow = (flowId) => {
  router.push({ path: '/admin/edit', query: { flowId } })
}

const createFlow = () => {
  // 创建新流程的逻辑
  alert('创建新流程功能')
}

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: var(--ios-background);
}

.dashboard-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.back-button {
  background: none;
  border: none;
  color: var(--ios-blue);
  font-size: 17px;
  cursor: pointer;
  padding: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flow-list {
  margin-top: 16px;
}

.flow-item {
  background-color: var(--ios-white);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.flow-name {
  font-size: 17px;
  font-weight: 600;
  flex: 1;
}

.flow-actions {
  display: flex;
  gap: 8px;
}

.ios-button-small {
  padding: 8px 16px;
  font-size: 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.ios-button-small:active {
  opacity: 0.6;
}
</style>
