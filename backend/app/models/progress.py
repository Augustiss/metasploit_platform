
from sqlalchemy import Column, Integer, String, ForeignKey, SmallInteger
from app.models import Base
from sqlalchemy.orm import relationship

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))
    status = Column(SmallInteger, default=0)  # Changed from Boolean to SmallInteger

    # Relationship to User
    user = relationship("User", back_populates="progress")

    @property
    def status_bool(self):
        return bool(self.status)