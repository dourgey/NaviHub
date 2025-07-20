# 构建前端
FROM node:16-alpine as frontend-builder

WORKDIR /app/frontend

# 复制前端文件
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# 构建后端
FROM python:3.9-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 复制后端文件
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# 从前端构建阶段复制构建产物
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# 创建启动脚本
RUN echo '#!/bin/bash\n\
cd /app/frontend/build && python3 -m http.server 3000 &\n\
cd /app && uvicorn main:app --host 0.0.0.0 --port 8000 &\n\
tail -f /dev/null' > /app/start.sh && chmod +x /app/start.sh

# 暴露端口
EXPOSE 3000 8000

# 启动命令
CMD ["/app/start.sh"] 