# app/schemas/progress.py

from pydantic import BaseModel, validator

class ProgressBase(BaseModel):
    task_id: int
    status: bool = False

class ProgressCreate(ProgressBase):
    user_id: int

class ProgressRead(ProgressBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

    @property
    def status(self) -> bool:
        if hasattr(self, '_obj'):
            return self._obj.status_bool
        return False