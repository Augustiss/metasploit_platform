# File: app/routes/users.py

from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, delete
from sqlalchemy.future import select
from passlib.context import CryptContext
from app.database import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.utils.auth import create_access_token, get_current_user, get_token_from_header
from datetime import datetime, timedelta
from app.models.progress import Progress  # Make sure to import Progress model


import logging
logging.basicConfig(level=logging.INFO)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()


async def get_user_by_username(session: AsyncSession, username: str) -> User | None:
    result = await session.execute(
        select(User).where(func.lower(User.username) == username.lower())
    )
    return result.scalars().first()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, session: AsyncSession = Depends(get_session)):
    try:
        logging.info(f"Incoming user data: {user}")

        existing_user = await get_user_by_username(session, user.username.lower())
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )

        hashed_password = hash_password(user.password)
        new_user = User(
            username=user.username.lower(),
            email=user.email,
            hashed_password=hashed_password,
        )

        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)

        return UserRead.from_orm(new_user)

    except HTTPException as http_err:
        logging.warning(f"User creation failed due to: {http_err.detail}")
        raise http_err
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration.",
        ) from e


@router.post("/login")
async def login(
        username: str = Form(...),
        password: str = Form(...),
        session: AsyncSession = Depends(get_session)
):
    user = await get_user_by_username(session, username)

    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if account is locked
    if user.disabled and user.disabled_until:
        if datetime.utcnow() < user.disabled_until:
            remaining_time = (user.disabled_until - datetime.utcnow()).seconds
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account is locked. Try again in {remaining_time} seconds"
            )
        else:
            # Reset lockout if timeout has passed
            user.disabled = False
            user.disabled_until = None
            user.login_attempts = 0

    # Verify password
    if not verify_password(password, user.hashed_password):
        # Increment login attempts
        user.login_attempts += 1

        # Check if we should lock the account
        if user.login_attempts >= 3:
            user.disabled = True
            user.disabled_until = datetime.utcnow() + timedelta(minutes=15)
            await session.commit()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account locked for 15 minutes due to too many failed attempts"
            )

        await session.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid password. {3 - user.login_attempts} attempts remaining",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Successful login - reset attempts
    user.login_attempts = 0
    user.disabled = False
    user.disabled_until = None
    await session.commit()

    access_token = create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "id": user.id
    }


@router.get("/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserRead.from_orm(current_user)

@router.delete("/me")
async def delete_account(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        # Delete progress records first using ORM
        await session.execute(
            delete(Progress).where(Progress.user_id == current_user.id)
        )
        
        # Delete the user
        await session.delete(current_user)
        await session.commit()
        
        logging.info(f"Successfully deleted user {current_user.id}")
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        logging.error(f"Failed to delete account: {str(e)}")
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )