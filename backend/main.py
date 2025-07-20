from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, links, users
from .database import engine, Base, SessionLocal
from . import models
from . import auth as auth_utils

# 创建数据库表
Base.metadata.create_all(bind=engine)

def init_admin_user():
    db = SessionLocal()
    try:
        # 检查是否已存在管理员账号
        admin = db.query(models.User).filter(models.User.username == "admin").first()
        if not admin:
            # 创建默认管理员账号
            admin_user = models.User(
                username="admin",
                email="admin@example.com",
                hashed_password=auth_utils.get_password_hash("admin"),
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("默认管理员账号已创建")
    finally:
        db.close()

# 初始化默认管理员账号
init_admin_user()

app = FastAPI(title="NaviHub API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(links.router, prefix="/api/links", tags=["链接"])
app.include_router(users.router, prefix="/api/users", tags=["用户"]) 