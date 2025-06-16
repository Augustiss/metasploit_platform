#/schemas/tasks.py

from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    description: str
    hint1: str
    hint2: str
    hint3: str
    note: Optional[str] = None

class Task(TaskBase):
    id: id
    correct_answer: str

    class Config:
        from_attributes = True