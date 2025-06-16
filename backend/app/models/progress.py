# app/models/progress.py

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.models import Base
from sqlalchemy.orm import relationship


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_name = Column(String)
    status = Column(Boolean, default=False)

    # Relationship to User
    user = relationship("User", back_populates="progress")

