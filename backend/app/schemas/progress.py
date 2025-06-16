# app/schemas/progress.py

from pydantic import BaseModel


class ProgressBase(BaseModel):
    task_name: str
    status: str = "Incomplete"  # Reflect the default value



class ProgressCreate(ProgressBase):
    user_id: int


class ProgressRead(ProgressBase):
    id: int
    user_id: int


    class Config:
        from_attributes = True
