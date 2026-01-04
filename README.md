# 工厂ERP系统

基于 Vue 3 + Vite 构建的工厂ERP管理系统，采用 iOS 设计风格。

## 技术栈

- Vue 3 (Composition API)
- Vue Router 4
- Pinia (状态管理)
- Vite (构建工具)
- Node.js 18+

## 安装和运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

## 功能说明

### 登录系统

- **管理员登录**：点击"管理员登录"按钮，自动登录并跳转到综合管理界面
- **员工登录**：点击"员工登录"按钮，根据权限级别跳转到相应界面
  - 默认权限：可查看（view）
  - 可在 `src/store/user.js` 中修改员工权限

### 管理员功能

1. **综合管理界面** (`/admin/dashboard`)
   - 查看所有流程列表
   - 点击"数据查看"查看流程数据
   - 点击"编辑"编辑流程详情
   - 创建新流程

2. **数据查看界面** (`/admin/data`)
   - 选择日期查看历史数据
   - 选择流程查看具体数据
   - 查看提交记录
   - 导出当日数据

3. **编辑界面** (`/admin/edit`)
   - 编辑流程信息
   - 管理指标
   - 设置用户权限（可查看/可编辑/无权限）

### 员工功能

根据权限级别显示不同功能：

1. **无权限** (`employeePermission: 'none'`)
   - 左侧不显示任何流程
   - 显示"无权限"提示

2. **可查看权限** (`employeePermission: 'view'`)
   - 左侧显示可用流程
   - 可以查看流程数据（只读）
   - 显示最后提交信息
   - 不能修改数据

3. **可编辑权限** (`employeePermission: 'edit'`)
   - 左侧显示可用流程
   - 可以选择日期
   - 可以修改"待填写"的数据
   - 可以提交数据

## 权限测试

在 `src/store/user.js` 的 `login` 方法中，可以通过修改密码来测试不同权限：

```javascript
// 可查看权限
userStore.login('employee', 'view', 'employee')

// 可编辑权限
userStore.login('employee', 'edit', 'employee')

// 无权限（其他密码）
userStore.login('employee', 'other', 'employee')
```

## 项目结构

```
vue3-ios-project/
├── src/
│   ├── views/              # 页面组件
│   │   ├── LoginView.vue          # 登录页面
│   │   ├── AdminDashboardView.vue # 管理员综合管理界面
│   │   ├── AdminDataView.vue      # 管理员数据查看
│   │   ├── AdminEditView.vue      # 管理员编辑界面
│   │   └── EmployeeFlowView.vue   # 员工工作流程界面
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── store/              # 状态管理
│   │   └── user.js         # 用户状态和权限管理
│   ├── style.css           # iOS风格全局样式
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── package.json
└── vite.config.js
```

## iOS 设计风格

项目采用 iOS 官方设计规范：

- 使用系统字体：`-apple-system, BlinkMacSystemFont`
- iOS 标准颜色：蓝色 (#007AFF)、灰色 (#8E8E93) 等
- 圆角设计：按钮和卡片使用 10px 圆角
- 毛玻璃效果和阴影
- 响应式布局，支持移动端和桌面端

## 开发说明

### 添加新流程

在相应的组件中修改 `flows` 数组：

```javascript
const flows = ref([
  { id: 1, name: '流程1' },
  { id: 2, name: '流程2' },
  // 添加新流程
])
```

### 自定义样式

所有 iOS 风格样式变量定义在 `src/style.css` 中：

```css
:root {
  --ios-blue: #007AFF;
  --ios-gray: #8E8E93;
  --ios-light-gray: #F2F2F7;
  /* ... */
}
```

## 注意事项

- 当前为演示版本，数据为模拟数据
- 实际项目中需要连接后端 API
- 权限管理需要后端验证
- 数据提交需要后端接口支持

## License

MIT
