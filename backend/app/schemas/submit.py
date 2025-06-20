# app/schemas/submit.py
from pydantic import BaseModel
from typing import Dict

class SubmitTaskPayload(BaseModel):
    session_id: str
    answers: Dict[str, str]
