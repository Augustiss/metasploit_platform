# app/routes/progress.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.models.progress import Progress
from app.models.user import User
from app.schemas.progress import ProgressCreate, ProgressRead
from typing import List
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/user-progress", response_model=List[ProgressRead])
async def get_user_progress(
    current_user=Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Progress).where(Progress.user_id == current_user.id)
    result = await session.execute(stmt)
    entries = result.scalars().all()

    for e in entries:
        print(f"DEBUG ENTRY: id={e.id}, task_id={e.task_id}, status={e.status}")

    return [ProgressRead.from_orm(e) for e in entries]

@router.post("/", response_model=ProgressRead)
async def create_progress(
    progress: ProgressCreate,
    session: AsyncSession = Depends(get_session)
):
    # First try to find existing progress
    stmt = select(Progress).where(
        (Progress.user_id == progress.user_id) &
        (Progress.task_id == progress.task_id)
    )
    result = await session.execute(stmt)
    existing_progress = result.scalar_one_or_none()

    if existing_progress:
        # Update existing progress
        existing_progress.status = progress.status
        await session.commit()
        await session.refresh(existing_progress)
        return existing_progress
    else:
        # Create new progress
        new_progress = Progress(
            user_id=progress.user_id,
            task_id=progress.task_id,
            status=progress.status
        )
        session.add(new_progress)
        await session.commit()
        await session.refresh(new_progress)
        return new_progress


@router.get("/", response_model=List[ProgressRead])
async def get_user_progress_by_id(
    user_id: int,
    session: AsyncSession = Depends(get_session)
):
    results = await session.execute(
        Progress.__table__.select().where(Progress.user_id == user_id)
    )
    entries = results.scalars().all()
    if not entries:
        raise HTTPException(status_code=404, detail="No progress found for this user.")
    return entries
