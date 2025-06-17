# app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import create_tables
from app.routes import users, progress
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.DEBUG)


# Lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await create_tables()
    yield
    # Shutdown logic (if needed)
    pass


# Create FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://161.35.18.245:5173"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers needed for requests
)


# Include routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])


# Root endpoint
@app.get("/", tags=["Core"])
def read_root():
    return {"message": "Welcome to the Interactive Learning Platform for Metasploit"}
