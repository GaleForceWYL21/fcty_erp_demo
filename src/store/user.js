import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        isAuthenticated: false,
        userRole: null, // 'admin' or 'employee'
        currentUser: null,
        // 流程权限配置：用户 -> 流程ID -> 权限级别
        // 示例：{ 'abc': { 1: 'edit', 2: 'view' }, 'def': { 1: 'view', 2: 'edit' } }
        flowPermissions: {
            'abc': {
                1: 'edit',  // 流程1可编辑
                2: 'view'   // 流程2可查看
            },
            'def': {
                1: 'view',  // 流程1可查看
                2: 'edit'   // 流程2可编辑
            },
            'ghi': {
                1: 'none',  // 流程1无权限
                2: 'view'   // 流程2可查看
            }
        }
    }),
    actions: {
        login(username, userType = null) {
            // 登录逻辑
            if (userType === 'admin' || username === 'admin') {
                this.isAuthenticated = true;
                this.userRole = 'admin';
                this.currentUser = { username: 'admin', name: '管理员' };
                return true;
            } else if (userType === 'employee' || ['abc', 'def', 'ghi'].includes(username)) {
                this.isAuthenticated = true;
                this.userRole = 'employee';
                this.currentUser = { 
                    username: username, 
                    name: `用户${username}` 
                };
                return true;
            }
            return false;
        },
        logout() {
            this.isAuthenticated = false;
            this.userRole = null;
            this.currentUser = null;
        },
        // 设置用户在某个流程的权限
        setFlowPermission(username, flowId, permission) {
            if (!this.flowPermissions[username]) {
                this.flowPermissions[username] = {};
            }
            this.flowPermissions[username][flowId] = permission;
        },
        // 获取用户在某个流程的权限
        getFlowPermission(username, flowId) {
            if (this.userRole === 'admin') {
                return 'edit'; // 管理员拥有所有权限
            }
            if (!this.flowPermissions[username]) {
                return 'none';
            }
            return this.flowPermissions[username][flowId] || 'none';
        },
        // 获取用户有权限的所有流程ID
        getAvailableFlows(username) {
            if (this.userRole === 'admin') {
                return [1, 2]; // 管理员可以看到所有流程
            }
            if (!this.flowPermissions[username]) {
                return [];
            }
            return Object.keys(this.flowPermissions[username])
                .map(id => parseInt(id))
                .filter(id => this.flowPermissions[username][id] !== 'none');
        }
    },
    getters: {
        // 检查用户是否可以查看某个流程
        canViewFlow: (state) => (flowId) => {
            if (state.userRole === 'admin') return true;
            if (state.userRole === 'employee' && state.currentUser) {
                const permission = state.flowPermissions[state.currentUser.username]?.[flowId];
                return permission === 'view' || permission === 'edit';
            }
            return false;
        },
        // 检查用户是否可以编辑某个流程
        canEditFlow: (state) => (flowId) => {
            if (state.userRole === 'admin') return true;
            if (state.userRole === 'employee' && state.currentUser) {
                const permission = state.flowPermissions[state.currentUser.username]?.[flowId];
                return permission === 'edit';
            }
            return false;
        }
    }
})