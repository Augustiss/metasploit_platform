# app/routes/tasks.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.tasks import Task
from app.models.progress import Progress
from app.schemas.submit import SubmitTaskPayload
from uuid import uuid4
from app.utils.auth import get_current_user
from app.database import get_session
from typing import List


router = APIRouter()

@router.get("/get-tasks/{chapter_id}")
async def get_tasks(chapter_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Task).where(Task.chapter_id == chapter_id)
    )
    tasks = result.scalars().all()
    return [
        {
            "id": task.id,
            "question": task.description,
            "hint1": task.hint1,
            "hint2": task.hint2,
            "hint3": task.hint3,
            "note": task.note
        } for task in tasks
    ]

@router.post("/start-task")
async def start_task(user=Depends(get_current_user)):
    session_id = str(uuid4())
    return {"session_id": session_id}

@router.post("/submit-task")
async def submit_task(
    payload: SubmitTaskPayload,
    db: AsyncSession = Depends(get_session),
    current_user = Depends(get_current_user),
):
    task_ids = [int(tid) for tid in payload.answers.keys()]
    result = await db.execute(select(Task).where(Task.id.in_(task_ids)))
    tasks: List[Task] = result.scalars().all()
    if not tasks:
        raise HTTPException(400, "No tasks found for those IDs")

    total = len(tasks)
    correct = 0

    for task in tasks:
        ans = payload.answers.get(str(task.id), "").strip().lower()
        expected = task.correct_answer.strip().lower()
        is_ok = expected in ans

        if is_ok:
            correct += 1

        # Find existing progress
        stmt = select(Progress).where(
            (Progress.user_id == current_user.id) &
            (Progress.task_id == task.id)
        )
        result = await db.execute(stmt)
        existing_progress = result.scalar_one_or_none()

        if existing_progress:
            # Update existing progress
            existing_progress.status = is_ok
        else:
            # Create new progress
            prog = Progress(
                user_id=current_user.id,
                task_id=task.id,
                status=is_ok
            )
            db.add(prog)

    await db.commit()
    score = round(correct / total * 100, 2)
    return {"score": score}