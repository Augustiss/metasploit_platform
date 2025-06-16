# ./app/utils/auth.py

from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, Request
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.models.user import User
from app.services.user_service import get_user_by_username

# Configuration for JWT
SECRET_KEY = "change-this-to-a-secure-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 150  # Token validity in minutes


def create_access_token(data: dict) -> str:
    """
    Create and return a JWT token.
    Includes an expiration time.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})  # Add expiration timestamp
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str) -> dict:
    """
    Verifies the JWT token and decodes the payload.
    If verification fails, raises an HTTPException.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from e


def get_token_from_header(request: Request) -> str:
    """
    Extracts the JWT token from the "Authorization" HTTP header.
    If the token is missing or improperly formatted, raises an HTTPException.
    """
    authorization: str = request.headers.get("Authorization")
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format. Use 'Bearer <token>'.")

    return authorization.split(" ")[1]


async def get_current_user(
    request: Request,
    session: AsyncSession = Depends(get_session)
) -> User:
    """
    Fetch the currently authenticated user based on the provided JWT token.
    Uses the request object to extract the Authorization header.
    """
    token = get_token_from_header(request)
    try:
        payload = verify_access_token(token)
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await get_user_by_username(session, username)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials or expired token")
