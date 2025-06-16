from app.models import Base
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, as_declarative

@as_declarative()
class Base:
    pass

DATABASE_URL = "sqlite+aiosqlite:///./user_and_progress.db"

engine = create_async_engine(DATABASE_URL, future=True, echo=True)
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_session():
    async with async_session() as session:
        yield session


# To create database tables
async def create_tables():
    from app.models import Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


TASKS_DB_URL = "sqlite+aiosqlite:///./tasks.db"
tasks_engine = create_async_engine(TASKS_DB_URL, future=True, echo=True)
TasksSession = sessionmaker(tasks_engine, class_=AsyncSession, expire_on_commit=False)

async def create_tasks_tables():
    from app.models import Base  # arba tinkamai nurodyk Base klasių failą
    async with tasks_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
