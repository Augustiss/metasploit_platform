from fastapi import APIRouter, Depends, HTTPException
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
        current_user: User = Depends(get_current_user),
        session: AsyncSession = Depends(get_session),
):
    """
    Fetch progress for the currently authenticated user.
    """
    results = await session.execute(
        Progress.__table__.select().where(Progress.user_id == current_user.id)
    )
    return results.scalars().all()


@router.post("/", response_model=ProgressRead)
async def create_progress(
        progress: ProgressCreate, session: AsyncSession = Depends(get_session)
):
    """
    Create a new progress entry for a user.
    """
    new_progress = Progress(
        user_id=progress.user_id,
        task_name=progress.task_name,
        status=progress.status,
    )
    session.add(new_progress)
    await session.commit()
    await session.refresh(new_progress)
    return new_progress


@router.get("/", response_model=List[ProgressRead])
async def get_user_progress_by_id(user_id: int, session: AsyncSession = Depends(get_session)):
    """
    Get all progress entries for a specific user by ID.
    """
    results = await session.execute(
        Progress.__table__.select().where(Progress.user_id == user_id)
    )
    progress_entries = results.scalars().all()

    if not progress_entries:
        raise HTTPException(status_code=404, detail="No progress found for this user.")

    return progress_entries
