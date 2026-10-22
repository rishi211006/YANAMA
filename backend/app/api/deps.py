from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[User]:
    if not token:
        # Fallback to demo user if no token provided during testing
        user = db.query(User).filter(User.email == "demo@yanama.ai").first()
        return user
        
    user_id = decode_access_token(token)
    if not user_id:
        user = db.query(User).filter(User.email == "demo@yanama.ai").first()
        return user
        
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        user = db.query(User).filter(User.email == "demo@yanama.ai").first()
    return user
