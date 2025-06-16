# app/models/tasks.py

from sqlalchemy import Column, Integer, String, Boolean
from app.models import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)  # Unique ID for each task
    description = Column(String, nullable=False)  # Task description
    hint1 = Column(String, nullable=False)
    hint2 = Column(String, nullable=False)
    hint3 = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)  # The correct answer(s) for the task
    note = Column(String, nullable=True)

    def __repr__(self):
        return f"<Task(id={self.id}, description={self.description})>"
