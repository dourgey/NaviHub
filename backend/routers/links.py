from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, auth
from ..database import get_db
from pydantic import BaseModel

router = APIRouter()

class LinkBase(BaseModel):
    name: str
    description: Optional[str] = None
    url: str
    icon: Optional[str] = None
    group: Optional[str] = None

class LinkCreate(LinkBase):
    pass

class Link(LinkBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[Link])
async def get_links(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Link).all()

@router.post("/", response_model=Link)
async def create_link(
    link: LinkCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    db_link = models.Link(**link.dict())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@router.put("/{link_id}", response_model=Link)
async def update_link(
    link_id: int,
    link: LinkCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    db_link = db.query(models.Link).filter(models.Link.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="链接不存在")
    
    for key, value in link.dict().items():
        setattr(db_link, key, value)
    
    db.commit()
    db.refresh(db_link)
    return db_link

@router.put("/{link_id}/", response_model=Link)
async def update_link_slash(
    link_id: int,
    link: LinkCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    return await update_link(link_id, link, db, current_user)

@router.delete("/{link_id}")
async def delete_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    db_link = db.query(models.Link).filter(models.Link.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="链接不存在")
    
    db.delete(db_link)
    db.commit()
    return {"message": "链接已删除"}

@router.delete("/{link_id}/")
async def delete_link_slash(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    return await delete_link(link_id, db, current_user) 