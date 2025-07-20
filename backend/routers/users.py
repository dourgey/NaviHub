from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, auth
from ..database import get_db
from pydantic import BaseModel

router = APIRouter()

class UserBase(BaseModel):
    username: str
    email: str
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[User])
async def get_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    return db.query(models.User).all()

@router.post("/", response_model=User)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="用户名已存在")
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="邮箱已存在")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_admin=user.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    # 检查用户名是否重复
    if user.username != db_user.username:
        existing_user = db.query(models.User).filter(models.User.username == user.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="用户名已存在")
    
    # 检查邮箱是否重复
    if user.email != db_user.email:
        existing_user = db.query(models.User).filter(models.User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="邮箱已存在")
    
    db_user.username = user.username
    db_user.email = user.email
    db_user.hashed_password = auth.get_password_hash(user.password)
    db_user.is_admin = user.is_admin
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/{user_id}/", response_model=User)
async def update_user_slash(
    user_id: int,
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    return await update_user(user_id, user, db, current_user)

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="不能删除当前用户")
    
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    db.delete(db_user)
    db.commit()
    return {"message": "用户已删除"}

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: models.User = Depends(auth.get_current_user)
):
    return current_user

# 兼容带斜杠的路由，防止 307 重定向导致 token 丢失
@router.get("/me/", response_model=User)
async def get_current_user_info_slash(
    current_user: models.User = Depends(auth.get_current_user)
):
    return current_user 