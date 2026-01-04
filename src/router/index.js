import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminDataView from '../views/AdminDataView.vue'
import AdminEditView from '../views/AdminEditView.vue'
import EmployeeFlowView from '../views/EmployeeFlowView.vue'
import { useUserStore } from '@/store/user'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboardView,
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/data',
        name: 'AdminData',
        component: AdminDataView,
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/edit',
        name: 'AdminEdit',
        component: AdminEditView,
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/employee/flow',
        name: 'EmployeeFlow',
        component: EmployeeFlowView,
        meta: { requiresAuth: true, role: 'employee' }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const store = useUserStore()
    if (to.meta.requiresAuth && !store.isAuthenticated) {
        next('/login')
    } else if (to.meta.role && store.userRole !== to.meta.role) {
        next('/login')
    } else {
        next()
    }
})

export default router