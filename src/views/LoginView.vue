<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">工厂ERP系统</h1>
      <div class="login-buttons">
        <button class="ios-button" @click="login('admin')">
          管理员登录
        </button>
        <button class="ios-button ios-button-secondary" @click="showEmployeeList = true">
          员工登录
        </button>
      </div>
      
      <!-- 员工列表 -->
      <div v-if="showEmployeeList" class="employee-list">
        <p class="ios-text-secondary" style="margin-bottom: 12px;">选择用户：</p>
        <div 
          v-for="user in employees" 
          :key="user.username"
          class="employee-item"
          @click="login('employee', user.username)"
        >
          <div class="employee-avatar">{{ user.name.charAt(user.name.length - 1) }}</div>
          <div class="employee-info">
            <div class="employee-name">{{ user.name }}</div>
            <div class="employee-permissions">
              <span v-for="(perm, flowId) in user.permissions" :key="flowId" class="permission-tag">
                流程{{ flowId }}: {{ getPermissionText(perm) }}
              </span>
            </div>
          </div>
        </div>
        <button class="cancel-button" @click="showEmployeeList = false">取消</button>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const error = ref('')
const showEmployeeList = ref(false)

// 员工列表，显示每个用户的权限
const employees = computed(() => {
  const permissions = userStore.flowPermissions
  return [
    {
      username: 'abc',
      name: '用户abc',
      permissions: permissions['abc'] || {}
    },
    {
      username: 'def',
      name: '用户def',
      permissions: permissions['def'] || {}
    },
    {
      username: 'ghi',
      name: '用户ghi',
      permissions: permissions['ghi'] || {}
    }
  ]
})

const getPermissionText = (permission) => {
  const map = {
    'none': '无权限',
    'view': '可查看',
    'edit': '可编辑'
  }
  return map[permission] || '无权限'
}

const login = (userType, username = null) => {
  error.value = ''
  showEmployeeList.value = false
  
  // 模拟登录
  let success = false
  if (userType === 'admin') {
    success = userStore.login('admin', 'admin')
  } else if (userType === 'employee' && username) {
    success = userStore.login(username, 'employee')
  }
  
  if (success) {
    if (userType === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/employee/flow')
    }
  } else {
    error.value = '登录失败，请重试'
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background-color: var(--ios-white);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--ios-text);
  margin-bottom: 40px;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.error-message {
  margin-top: 20px;
  color: var(--ios-red);
  font-size: 15px;
}

.employee-list {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--ios-border);
  text-align: left;
}

.employee-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin: 8px 0;
  background-color: var(--ios-light-gray);
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.employee-item:active {
  background-color: var(--ios-border);
}

.employee-avatar {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: var(--ios-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
}

.employee-info {
  flex: 1;
}

.employee-name {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--ios-text);
}

.employee-permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.permission-tag {
  font-size: 12px;
  color: var(--ios-secondary-text);
  background-color: var(--ios-white);
  padding: 2px 8px;
  border-radius: 6px;
}

.cancel-button {
  width: 100%;
  padding: 12px 20px;
  margin-top: 12px;
  background: none;
  color: var(--ios-gray);
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>
