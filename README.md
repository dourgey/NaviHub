# NaviHub - 现代化导航管理系统

[![Badge](https://img.shields.io/badge/link-996.icu-%23FF4D5B.svg?style=flat-square)](https://996.icu/#/en_US)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![Slack](https://img.shields.io/badge/slack-996icu-green.svg?style=flat-square)](https://join.slack.com/t/996icu/shared_invite/enQtNjI0MjEzMTUxNDI0LTkyMGViNmJiZjYwOWVlNzQ3NmQ4NTQyMDRiZTNmOWFkMzYxZWNmZGI0NDA4MWIwOGVhOThhMzc3NGQyMDBhZDc)

NaviHub 是一个现代化的导航管理系统，提供美观的界面和强大的管理功能。系统采用前后端分离架构，使用 React 和 FastAPI 构建，支持 Docker 部署。

## 功能特点

- 🎨 美观的 Metro 风格界面
- 🔐 用户认证和授权
- 👥 用户管理（管理员功能）
- 🔗 链接分类管理
- 📱 响应式设计，支持移动端
- 🚀 高性能后端 API
- 🔄 实时数据更新

## 技术栈

### 前端

- React 18
- Ant Design
- React Router
- Axios

### 后端

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT 认证

### 部署

- Docker
- Docker Compose
- Nginx (可选)

## 快速开始

### 使用 Docker 部署

1. 克隆项目

```bash
git clone https://github.com/dourgey/navihub.git
cd navihub
```

2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env
# 编辑 .env 文件，设置必要的环境变量
```

3. 启动服务

```bash
docker-compose up -d
```

4. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

### 手动部署

#### 后端部署

1. 创建虚拟环境

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

3. 配置数据库

```bash
# 创建 .env 文件并设置环境变量
DATABASE_URL=postgresql://user:password@localhost:5432/navihub
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. 启动服务

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 前端部署

1. 安装依赖

```bash
cd frontend
npm install
```

2. 配置环境变量

```bash
# 创建 .env 文件
REACT_APP_API_URL=http://localhost:8000
```

3. 启动开发服务器

```bash
npm start
```

4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
navihub/
├── backend/                # 后端代码
│   ├── main.py            # 主应用入口
│   ├── models.py          # 数据模型
│   ├── routers/           # API 路由
│   ├── auth.py            # 认证相关
│   └── requirements.txt   # Python 依赖
├── frontend/              # 前端代码
│   ├── src/              # 源代码
│   ├── public/           # 静态资源
│   └── package.json      # Node.js 依赖
├── docker-compose.yml    # Docker 编排配置
├── Dockerfile            # 后端 Dockerfile
└── frontend/Dockerfile   # 前端 Dockerfile
```

## API 文档

启动后端服务后，访问以下地址查看完整的 API 文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 环境变量

### 后端环境变量

- `DATABASE_URL`: PostgreSQL 数据库连接 URL
- `SECRET_KEY`: JWT 密钥
- `ALGORITHM`: JWT 算法
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 访问令牌过期时间

### 前端环境变量

- `REACT_APP_API_URL`: 后端 API 地址

## 开发指南

### 代码规范

- 后端遵循 PEP 8 规范
- 前端使用 ESLint 和 Prettier 进行代码格式化

### 提交规范

- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- test: 测试用例修改
- chore: 其他修改

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 Anti-996 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
