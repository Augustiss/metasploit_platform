from app.models import Base
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, as_declarative

@as_declarative()
class Base:
    pass

DATABASE_URL = "sqlite+aiosqlite:///./metasploit_platform.db"

engine = create_async_engine(DATABASE_URL, future=True, echo=True)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Pagrindinis session importavimui kituose failuose
async def get_session():
    async with async_session() as session:
        yield session

# Inicializuoja visas lenteles (user, progress, tasks)
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
