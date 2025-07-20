# 构建前端
FROM node:16-alpine as frontend-builder

WORKDIR /app/frontend

# 复制前端文件
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# 构建后端
FROM python:3.12

# 换成清华源
RUN echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware" > /etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware" >> /etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware" >> /etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware" >> /etc/apt/sources.list

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    build-essential nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# 复制后端文件
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple -r requirements.txt

COPY backend/ .

# 从前端构建阶段复制构建产物
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

RUN npm install -g serve

# 创建启动脚本
RUN echo '#!/bin/bash\n\
serve -s /app/frontend/build -l 3000 > /app/serve.log 2>&1 &\n\
cd / && uvicorn app.main:app > /app/uvicorn.log 2>&1  &\n\
tail -f /app/serve.log /app/uvicorn.log' > /app/start.sh && chmod +x /app/start.sh

# 暴露端口
EXPOSE 3000 8000

# 启动命令
CMD ["/app/start.sh"] 