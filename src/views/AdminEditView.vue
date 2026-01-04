<template>
  <div class="admin-edit-view">
    <div class="ios-navbar">
      <button class="back-button" @click="goBack">← 返回</button>
      <div class="ios-navbar-title">编辑流程</div>
      <button class="save-button" @click="saveChanges">保存</button>
    </div>

    <div class="edit-content">
      <div class="layout-container">
        <!-- 左侧边栏 -->
        <div class="ios-sidebar">
          <div class="ios-sidebar-item active">项目1</div>
          <div 
            v-for="flow in flows" 
            :key="flow.id"
            class="ios-sidebar-item"
            :class="{ active: selectedFlowId === flow.id }"
            @click="selectFlow(flow.id)"
          >
            {{ flow.name }}
          </div>
          <div class="ios-sidebar-item new-flow" @click="createFlow">
            +新建流程
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="main-content">
          <div class="ios-card">
            <h2 class="ios-subtitle">{{ currentFlow?.name || '流程1' }}</h2>
            
            <!-- 用户权限管理 -->
            <div class="permission-section">
              <button class="ios-button-small" @click="showPermissionModal = true">
                用户权限
              </button>
            </div>

            <!-- 编辑流程按钮 -->
            <div class="edit-flow-section">
              <button 
                class="ios-button" 
                :class="{ 'ios-button-secondary': !isEditMode }"
                @click="toggleEditMode"
              >
                {{ isEditMode ? '完成编辑' : '编辑流程' }}
              </button>
            </div>

            <!-- 指标表格 -->
            <div class="indicators-section">
              <div class="ios-table-header" :class="{ 'with-actions': isEditMode }">
                <div>编号</div>
                <div>工序名称</div>
                <div>指标名称</div>
                <div>参数类型</div>
                <div v-if="isEditMode" class="action-header">操作</div>
              </div>
              <div 
                v-for="(indicator, index) in indicators" 
                :key="indicator.id"
                class="ios-table-row"
                :class="{ 'with-actions': isEditMode }"
              >
                <div>{{ indicator.id }}</div>
                <div v-if="!isEditMode || editingIndex !== index">
                  {{ indicator.processName }}
                </div>
                <div v-else>
                  <input 
                    type="text" 
                    v-model="indicator.processName"
                    class="ios-input-inline"
                  />
                </div>
                <div v-if="!isEditMode || editingIndex !== index">
                  {{ indicator.indicatorName }}
                </div>
                <div v-else>
                  <input 
                    type="text" 
                    v-model="indicator.indicatorName"
                    class="ios-input-inline"
                  />
                </div>
                <div v-if="!isEditMode || editingIndex !== index">
                  {{ indicator.paramType }}
                </div>
                <div v-else>
                  <input 
                    type="text" 
                    v-model="indicator.paramType"
                    class="ios-input-inline"
                  />
                </div>
                <div v-if="isEditMode" class="action-buttons">
                  <button 
                    v-if="editingIndex !== index"
                    class="ios-button-tiny"
                    @click="editIndicator(index)"
                  >
                    修改
                  </button>
                  <button 
                    v-if="editingIndex === index"
                    class="ios-button-tiny ios-button-success"
                    @click="saveIndicator(index)"
                  >
                    保存
                  </button>
                  <button 
                    class="ios-button-tiny ios-button-danger"
                    @click="deleteIndicator(index)"
                  >
                    删除
                  </button>
                </div>
              </div>
              
              <!-- 新建指标按钮 - 仅在编辑模式下显示 -->
              <div v-if="isEditMode" class="new-indicator-section">
                <button 
                  v-if="!showNewIndicatorForm"
                  class="ios-button ios-button-secondary" 
                  @click="showNewIndicatorForm = true"
                >
                  +新建指标
                </button>
                
                <!-- 新建指标表单 -->
                <div v-if="showNewIndicatorForm" class="new-indicator-form">
                  <div class="form-row">
                    <label>工序名称：</label>
                    <input 
                      type="text" 
                      v-model="newIndicator.processName"
                      class="ios-input"
                      placeholder="请输入工序名称"
                    />
                  </div>
                  <div class="form-row">
                    <label>指标名称：</label>
                    <input 
                      type="text" 
                      v-model="newIndicator.indicatorName"
                      class="ios-input"
                      placeholder="请输入指标名称"
                    />
                  </div>
                  <div class="form-row">
                    <label>参数类型：</label>
                    <input 
                      type="text" 
                      v-model="newIndicator.paramType"
                      class="ios-input"
                      placeholder="请输入参数类型"
                    />
                  </div>
                  <div class="form-actions">
                    <button 
                      class="ios-button" 
                      @click="confirmAddIndicator"
                    >
                      完成新增
                    </button>
                    <button 
                      class="ios-button ios-button-secondary" 
                      @click="cancelAddIndicator"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 权限管理弹窗 -->
    <div v-if="showPermissionModal" class="modal-overlay" @click="showPermissionModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>用户权限管理</h3>
          <button class="close-button" @click="showPermissionModal = false">×</button>
        </div>
        <div class="search-section">
          <input 
            type="text" 
            placeholder="搜索成员" 
            class="ios-input"
            v-model="searchKeyword"
          />
        </div>
        <div class="member-list">
          <div class="member-item" v-for="member in filteredMembers" :key="member.username">
            <div class="member-name">{{ member.name }}</div>
            <select 
              v-model="member.permission" 
              class="permission-select"
              @change="updatePermission(member)"
            >
              <option value="none">无权限</option>
              <option value="view">可查看</option>
              <option value="edit">可编辑</option>
            </select>
          </div>
        </div>
        <button class="ios-button" @click="savePermissions">保存修改</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const selectedFlowId = ref(1)
const flows = ref([
  { id: 1, name: '流程1' },
  { id: 2, name: '流程2' }
])

const currentFlow = computed(() => {
  return flows.value.find(f => f.id === selectedFlowId.value)
})

// 根据流程ID获取指标数据
const getIndicatorsByFlow = (flowId) => {
  if (flowId === 1) {
    return [
      { id: 1, processName: '压铸', indicatorName: '完成数量', paramType: '500个' },
      { id: 2, processName: '压铸良品率', indicatorName: '百分比', paramType: '93%' }
    ]
  } else if (flowId === 2) {
    return [
      { id: 1, processName: '表盘抛光', indicatorName: '完成数量', paramType: '300个' },
      { id: 2, processName: '抛光良品率', indicatorName: '百分比', paramType: '88%' }
    ]
  }
  return []
}

const indicators = ref(getIndicatorsByFlow(1))

// 编辑模式相关
const isEditMode = ref(false)
const editingIndex = ref(-1)
const showNewIndicatorForm = ref(false)
const newIndicator = ref({
  processName: '',
  indicatorName: '',
  paramType: ''
})

const showPermissionModal = ref(false)
const searchKeyword = ref('')

// 所有员工列表
const members = ref([
  { username: 'abc', name: '用户abc' },
  { username: 'def', name: '用户def' },
  { username: 'ghi', name: '用户ghi' }
])

// 获取每个成员在当前流程的权限
const membersWithPermissions = computed(() => {
  return members.value.map(member => ({
    ...member,
    permission: userStore.getFlowPermission(member.username, selectedFlowId.value) || 'none'
  }))
})

const filteredMembers = computed(() => {
  if (!searchKeyword.value) return membersWithPermissions.value
  return membersWithPermissions.value.filter(m => 
    m.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

onMounted(() => {
  if (route.query.flowId) {
    selectedFlowId.value = parseInt(route.query.flowId)
  }
  // 初始化时加载对应流程的指标数据
  indicators.value = getIndicatorsByFlow(selectedFlowId.value)
})

const selectFlow = (flowId) => {
  selectedFlowId.value = flowId
  // 切换流程时加载对应的指标数据
  indicators.value = getIndicatorsByFlow(flowId)
  // 退出编辑模式
  isEditMode.value = false
  editingIndex.value = -1
  showNewIndicatorForm.value = false
  // 切换流程时，如果权限弹窗打开，需要刷新权限显示
  if (showPermissionModal.value) {
    // 触发重新计算
  }
}

const createFlow = () => {
  const newFlow = {
    id: flows.value.length + 1,
    name: `流程${flows.value.length + 1}`
  }
  flows.value.push(newFlow)
  selectedFlowId.value = newFlow.id
  indicators.value = []
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  if (!isEditMode.value) {
    // 退出编辑模式时，取消所有编辑状态
    editingIndex.value = -1
    showNewIndicatorForm.value = false
    newIndicator.value = {
      processName: '',
      indicatorName: '',
      paramType: ''
    }
  }
}

const editIndicator = (index) => {
  editingIndex.value = index
}

const saveIndicator = (index) => {
  // 保存修改
  editingIndex.value = -1
  // 这里可以添加保存到后端的逻辑
}

const deleteIndicator = (index) => {
  if (confirm('确定要删除这个指标吗？')) {
    indicators.value.splice(index, 1)
    // 重新排序编号
    reorderIndicators()
  }
}

const reorderIndicators = () => {
  indicators.value.forEach((indicator, index) => {
    indicator.id = index + 1
  })
}

const confirmAddIndicator = () => {
  // 验证必填项
  if (!newIndicator.value.processName || !newIndicator.value.indicatorName || !newIndicator.value.paramType) {
    alert('请填写所有字段')
    return
  }
  
  // 获取新的编号（自动自增）
  const newId = indicators.value.length > 0 
    ? Math.max(...indicators.value.map(i => i.id)) + 1 
    : 1
  
  // 添加新指标
  indicators.value.push({
    id: newId,
    processName: newIndicator.value.processName,
    indicatorName: newIndicator.value.indicatorName,
    paramType: newIndicator.value.paramType
  })
  
  // 重新排序编号
  reorderIndicators()
  
  // 重置表单
  newIndicator.value = {
    processName: '',
    indicatorName: '',
    paramType: ''
  }
  showNewIndicatorForm.value = false
}

const cancelAddIndicator = () => {
  newIndicator.value = {
    processName: '',
    indicatorName: '',
    paramType: ''
  }
  showNewIndicatorForm.value = false
}

const updatePermission = (member) => {
  // 更新权限逻辑 - 这里只是本地更新，实际应该调用API
  console.log('更新权限', member, selectedFlowId.value)
}

const savePermissions = () => {
  // 保存权限到store
  filteredMembers.value.forEach(member => {
    userStore.setFlowPermission(member.username, selectedFlowId.value, member.permission)
  })
  showPermissionModal.value = false
  alert('权限已保存')
}

const saveChanges = () => {
  alert('保存成功')
  goBack()
}

const goBack = () => {
  router.push('/admin/dashboard')
}
</script>

<style scoped>
.admin-edit-view {
  min-height: 100vh;
  background-color: var(--ios-background);
}

.edit-content {
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

.save-button {
  background: none;
  border: none;
  color: var(--ios-blue);
  font-size: 17px;
  cursor: pointer;
  padding: 0;
}

.permission-section {
  margin: 20px 0;
}

.edit-flow-section {
  margin: 20px 0;
}

.indicators-section {
  margin-top: 20px;
}

.indicators-section .ios-table-header {
  background-color: var(--ios-light-gray);
  padding: 12px;
  font-weight: 600;
  font-size: 15px;
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr;
  gap: 8px;
  border-bottom: 0.5px solid var(--ios-border);
}

.indicators-section .ios-table-header.with-actions {
  grid-template-columns: 40px 1fr 1fr 1fr 120px;
}

.indicators-section .ios-table-row {
  padding: 12px;
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr;
  gap: 8px;
  border-bottom: 0.5px solid var(--ios-border);
  align-items: center;
}

.indicators-section .ios-table-row.with-actions {
  grid-template-columns: 40px 1fr 1fr 1fr 120px;
}

.indicators-section .ios-table-row:last-child {
  border-bottom: none;
}

.action-header {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.ios-button-tiny {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.ios-button-tiny:active {
  opacity: 0.6;
}

.ios-button-success {
  background-color: var(--ios-green);
  color: white;
}

.ios-button-danger {
  background-color: var(--ios-red);
  color: white;
}

.ios-input-inline {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--ios-border);
  border-radius: 6px;
  font-size: 15px;
}

.new-indicator-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--ios-border);
}

.new-indicator-form {
  background-color: var(--ios-light-gray);
  padding: 16px;
  border-radius: 10px;
  margin-top: 12px;
}

.form-row {
  margin-bottom: 12px;
}

.form-row label {
  display: block;
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ios-text);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.form-actions .ios-button {
  flex: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--ios-white);
  border-radius: 20px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 32px;
  color: var(--ios-gray);
  cursor: pointer;
  line-height: 1;
}

.search-section {
  margin-bottom: 20px;
}

.member-list {
  margin-bottom: 20px;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 0.5px solid var(--ios-border);
}

.member-item:last-child {
  border-bottom: none;
}

.permission-select {
  padding: 6px 12px;
  border: 1px solid var(--ios-border);
  border-radius: 8px;
  font-size: 15px;
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
