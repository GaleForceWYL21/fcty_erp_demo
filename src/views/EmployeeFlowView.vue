<template>
  <div class="employee-flow-view">
    <div class="ios-navbar">
      <button class="back-button" @click="logout">退出</button>
      <div class="ios-navbar-title">工作流程</div>
      <div class="user-info">
        <div class="ios-avatar">{{ userStore.currentUser?.name?.charAt(0) || 'E' }}</div>
      </div>
    </div>

    <div class="flow-content">
      <div class="layout-container">
        <!-- 左侧边栏 - 根据权限显示 -->
        <div class="ios-sidebar" v-if="availableFlows.length > 0">
          <div class="ios-sidebar-item active">项目1</div>
          <div 
            v-for="flow in availableFlows" 
            :key="flow.id"
            class="ios-sidebar-item"
            :class="{ active: selectedFlowId === flow.id }"
            @click="selectFlow(flow.id)"
          >
            {{ flow.name }}
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="main-content" v-if="selectedFlow && canViewCurrentFlow">
          <div class="ios-card">
            <h2 class="ios-subtitle">{{ selectedFlow.name }}</h2>
            
            <!-- 权限提示 -->
            <div class="permission-badge">
              <span class="ios-badge" :class="permissionClass">
                权限：{{ permissionText }}
              </span>
            </div>

            <!-- 日期选择 - 仅可编辑权限可见 -->
            <div v-if="canEditCurrentFlow" class="date-section">
              <label class="ios-text">选择日期</label>
              <input 
                type="date" 
                v-model="selectedDate" 
                class="ios-date-picker"
                @change="loadFlowData"
              />
            </div>

            <!-- 流程日期显示 - 可查看权限 -->
            <div v-else-if="flowData" class="date-display">
              <p class="ios-text">流程日期 {{ formatDate(flowData.date) }}</p>
            </div>

            <!-- 数据表格 -->
            <div v-if="flowData" class="data-section">
              <div class="ios-table-header">
                <div>编号</div>
                <div>工序名称</div>
                <div>指标名称</div>
                <div>参数类型</div>
              </div>
              <div 
                v-for="(item, index) in flowData.items" 
                :key="index"
                class="ios-table-row"
              >
                <div>{{ item.id }}</div>
                <div>{{ item.processName }}</div>
                <div>{{ item.indicatorName }}</div>
                <div>
                  <!-- 可编辑权限可以修改，其他只读 -->
                  <input 
                    v-if="canEditCurrentFlow && item.editable"
                    type="text" 
                    v-model="item.value"
                    class="ios-input-small"
                    :placeholder="item.placeholder"
                  />
                  <span v-else>{{ item.value }}</span>
                </div>
              </div>
            </div>

            <!-- 提交按钮 - 仅可编辑权限可见 -->
            <button 
              v-if="canEditCurrentFlow" 
              class="ios-button" 
              @click="submitData"
            >
              提交数据
            </button>

            <!-- 最后提交信息 - 可查看权限 -->
            <div v-if="!canEditCurrentFlow && flowData && flowData.lastSubmit" class="submit-info">
              <p class="ios-text-secondary">
                最后提交：{{ flowData.lastSubmit.time }} by {{ flowData.lastSubmit.user }}
              </p>
            </div>
          </div>
        </div>

        <!-- 无权限提示 -->
        <div v-else class="no-permission">
          <div class="ios-card">
            <p class="ios-text-secondary">您没有查看此流程的权限</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const selectedFlowId = ref(null)
const selectedDate = ref('')
const flowData = ref(null)

// 所有流程
const allFlows = ref([
  { id: 1, name: '流程1' },
  { id: 2, name: '流程2' }
])

// 根据权限过滤可用流程 - 只显示用户有权限的流程
const availableFlows = computed(() => {
  if (userStore.userRole === 'admin') {
    return allFlows.value
  }
  if (userStore.userRole === 'employee' && userStore.currentUser) {
    const availableFlowIds = userStore.getAvailableFlows(userStore.currentUser.username)
    return allFlows.value.filter(flow => availableFlowIds.includes(flow.id))
  }
  return []
})

const selectedFlow = computed(() => {
  return allFlows.value.find(f => f.id === selectedFlowId.value)
})

// 检查当前流程的查看权限
const canViewCurrentFlow = computed(() => {
  if (!selectedFlowId.value) return false
  return userStore.canViewFlow(selectedFlowId.value)
})

// 检查当前流程的编辑权限
const canEditCurrentFlow = computed(() => {
  if (!selectedFlowId.value) return false
  return userStore.canEditFlow(selectedFlowId.value)
})

// 获取当前流程的权限级别
const currentFlowPermission = computed(() => {
  if (!selectedFlowId.value || !userStore.currentUser) return 'none'
  if (userStore.userRole === 'admin') return 'edit'
  return userStore.getFlowPermission(userStore.currentUser.username, selectedFlowId.value)
})

const permissionText = computed(() => {
  const permission = currentFlowPermission.value
  if (permission === 'edit') return '可编辑'
  if (permission === 'view') return '可查看'
  return '无权限'
})

const permissionClass = computed(() => {
  const permission = currentFlowPermission.value
  if (permission === 'edit') return 'badge-edit'
  if (permission === 'view') return 'badge-view'
  return 'badge-none'
})

onMounted(() => {
  // 设置默认日期为今天
  const today = new Date()
  selectedDate.value = today.toISOString().split('T')[0]
  
  // 如果有可用流程，默认选择第一个
  if (availableFlows.value.length > 0) {
    selectedFlowId.value = availableFlows.value[0].id
    loadFlowData()
  }
})

const selectFlow = (flowId) => {
  selectedFlowId.value = flowId
  loadFlowData()
}

const loadFlowData = () => {
  if (!selectedFlowId.value) return
  
  const canEdit = canEditCurrentFlow.value
  
  // 根据流程ID加载不同的数据
  let items = []
  if (selectedFlowId.value === 1) {
    // 流程1的数据
    items = [
      { 
        id: 1, 
        processName: '压铸', 
        indicatorName: '完成数量', 
        paramType: '数量',
        value: canEdit ? '' : '499个',
        editable: true,
        placeholder: '待填写'
      },
      { 
        id: 2, 
        processName: '压铸良品率', 
        indicatorName: '百分比', 
        paramType: '百分比',
        value: canEdit ? '' : '88%',
        editable: true,
        placeholder: '待填写'
      }
    ]
  } else if (selectedFlowId.value === 2) {
    // 流程2的数据
    items = [
      { 
        id: 1, 
        processName: '表盘抛光', 
        indicatorName: '完成数量', 
        paramType: '数量',
        value: canEdit ? '' : '300个',
        editable: true,
        placeholder: '待填写'
      },
      { 
        id: 2, 
        processName: '抛光良品率', 
        indicatorName: '百分比', 
        paramType: '百分比',
        value: canEdit ? '' : '88%',
        editable: true,
        placeholder: '待填写'
      }
    ]
  }
  
  // 模拟数据
  flowData.value = {
    date: selectedDate.value || new Date().toISOString().split('T')[0],
    items: items,
    lastSubmit: canEdit ? null : {
      time: '2024年01月15日14时30分',
      user: '用户xxx'
    }
  }
}

const submitData = () => {
  // 验证数据
  const hasEmpty = flowData.value.items.some(item => !item.value)
  if (hasEmpty) {
    alert('请填写所有必填项')
    return
  }
  
  // 提交数据
  alert('数据提交成功')
  loadFlowData()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.employee-flow-view {
  min-height: 100vh;
  background-color: var(--ios-background);
}

.flow-content {
  padding: 20px;
}

.layout-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  flex: 1;
}

.permission-badge {
  margin: 16px 0;
}

.badge-edit {
  background-color: var(--ios-green);
}

.badge-view {
  background-color: var(--ios-blue);
}

.badge-none {
  background-color: var(--ios-gray);
}

.date-section {
  margin: 20px 0;
}

.date-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.date-display {
  margin: 20px 0;
  padding: 12px;
  background-color: var(--ios-light-gray);
  border-radius: 8px;
}

.data-section {
  margin: 20px 0;
}

.ios-input-small {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--ios-border);
  border-radius: 8px;
  font-size: 15px;
}

.submit-info {
  margin-top: 20px;
  padding: 12px;
  background-color: var(--ios-light-gray);
  border-radius: 8px;
}

.no-permission {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }
  
  .ios-sidebar {
    width: 100%;
    min-height: auto;
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
  
  .ios-sidebar-item {
    white-space: nowrap;
    margin: 0 8px;
  }
}
</style>
