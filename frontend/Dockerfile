FROM node:16-alpine

WORKDIR /app

# 复制项目文件
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

# 构建应用
RUN npm run build

# 安装 serve 用于提供静态文件服务
RUN npm install -g serve

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["serve", "-s", "build", "-l", "3000"] 