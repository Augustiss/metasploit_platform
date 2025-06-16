from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlalchemy.future import select
from passlib.context import CryptContext
from app.database import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.utils.auth import create_access_token, get_current_user, get_token_from_header
from fastapi.security import OAuth2PasswordRequestForm

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

    if user:
        logging.debug(f"Found user: {user.username}")
        is_password_valid = verify_password(password, user.hashed_password)
        logging.debug(f"Password valid: {is_password_valid}")
    else:
        logging.debug(f"User not found: {username}")

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

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
