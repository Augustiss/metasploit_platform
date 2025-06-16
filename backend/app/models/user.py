# app/models/user.py
from enum import Enum

from sqlalchemy import Column, Integer, String, Boolean
from app.models import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    disabled = Column(Boolean, default=False)

    # Relationship to Progress
    progress = relationship("Progress", back_populates="user")
